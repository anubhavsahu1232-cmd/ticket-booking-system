package com.ticketbooking.backend.service;

import com.ticketbooking.backend.entity.Booking;
import com.ticketbooking.backend.entity.BookingSeat;
import com.ticketbooking.backend.entity.Seat;
import com.ticketbooking.backend.entity.Show;
import com.ticketbooking.backend.entity.User;

import com.ticketbooking.backend.repository.BookingRepository;
import com.ticketbooking.backend.repository.BookingSeatRepository;
import com.ticketbooking.backend.repository.SeatRepository;
import com.ticketbooking.backend.repository.ShowRepository;
import com.ticketbooking.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;


@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    private final BookingSeatRepository bookingSeatRepository;

    private final SeatRepository seatRepository;

    private final ShowRepository showRepository;

    private final UserRepository userRepository;


    public BookingService(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            SeatRepository seatRepository,
            ShowRepository showRepository,
            UserRepository userRepository) {

        this.bookingRepository =
                bookingRepository;

        this.bookingSeatRepository =
                bookingSeatRepository;

        this.seatRepository =
                seatRepository;

        this.showRepository =
                showRepository;

        this.userRepository =
                userRepository;
    }


    // =====================================================
    // CREATE BOOKING
    // =====================================================

    @Transactional
    public BookingResponse createBooking(
            Long showId,
            List<Long> seatIds) {


        // ---------------------------------------------
        // Validate seats
        // ---------------------------------------------

        if (seatIds == null
                || seatIds.isEmpty()) {

            throw new IllegalArgumentException(
                    "At least one seat must be selected"
            );
        }


        // ---------------------------------------------
        // Remove duplicate seat IDs
        // ---------------------------------------------

        List<Long> uniqueSeatIds =
                new ArrayList<>(
                        new HashSet<>(seatIds)
                );


        // ---------------------------------------------
        // Find show
        // ---------------------------------------------

        Show show =
                showRepository.findById(showId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Show not found with id: "
                                                + showId
                                )
                        );


        // ---------------------------------------------
        // Current user
        // ---------------------------------------------

        User user =
                getCurrentUser();


        // ---------------------------------------------
        // Lock selected seats
        // ---------------------------------------------

        List<Seat> seats =
                seatRepository
                        .findAllByIdsForUpdate(
                                uniqueSeatIds
                        );


        if (seats.size()
                != uniqueSeatIds.size()) {

            throw new IllegalArgumentException(
                    "One or more selected seats do not exist"
            );
        }


        // ---------------------------------------------
        // Check venue
        // ---------------------------------------------

        Long venueId =
                show.getVenue().getId();


        for (Seat seat : seats) {

            if (!seat.getVenue()
                    .getId()
                    .equals(venueId)) {

                throw new IllegalArgumentException(
                        "Seat "
                                + seat.getSeatNumber()
                                + " does not belong to this show's venue"
                );
            }
        }


        // ---------------------------------------------
        // Expiry time
        // ---------------------------------------------

        LocalDateTime expiryTime =
                LocalDateTime.now()
                        .minusMinutes(10);


        // ---------------------------------------------
        // Cancel expired pending bookings
        // ---------------------------------------------

        bookingRepository
                .cancelExpiredPendingBookings(
                        expiryTime
                );


        // ---------------------------------------------
        // Remove seats from cancelled bookings
        // ---------------------------------------------

        bookingSeatRepository
                .deleteSeatsOfCancelledBookings();


        // ---------------------------------------------
        // Find booked seats
        // ---------------------------------------------

        List<BookingSeat> bookedSeats =
                bookingSeatRepository
                        .findBookedSeatsByShowId(
                                showId,
                                expiryTime
                        );


        Set<Long> bookedSeatIds =
                new HashSet<>();


        for (BookingSeat bookingSeat :
                bookedSeats) {

            bookedSeatIds.add(
                    bookingSeat
                            .getSeat()
                            .getId()
            );
        }


        // ---------------------------------------------
        // Check availability
        // ---------------------------------------------

        for (Seat seat : seats) {

            if (bookedSeatIds.contains(
                    seat.getId()
            )) {

                throw new IllegalArgumentException(
                        "Seat "
                                + seat.getSeatNumber()
                                + " is already booked"
                );
            }
        }


        // ---------------------------------------------
        // Calculate total
        // ---------------------------------------------

        BigDecimal totalAmount =
                BigDecimal.ZERO;


        for (Seat seat : seats) {

            totalAmount =
                    totalAmount.add(
                            seat.getPrice()
                    );
        }


        // ---------------------------------------------
        // Create booking
        // ---------------------------------------------

        Booking booking =
                new Booking();


        booking.setUser(user);

        booking.setShow(show);

        booking.setBookingReference(
                generateBookingReference()
        );

        booking.setTotalAmount(
                totalAmount
        );

        booking.setStatus(
                Booking.BookingStatus.PENDING
        );

        booking.setBookingDate(
                LocalDateTime.now()
        );


        Booking savedBooking =
                bookingRepository.save(
                        booking
                );


        // ---------------------------------------------
        // Create booking seats
        // ---------------------------------------------

        List<BookingSeat> bookingSeats =
                new ArrayList<>();


        for (Seat seat : seats) {

            BookingSeat bookingSeat =
                    new BookingSeat();


            bookingSeat.setBooking(
                    savedBooking
            );

            bookingSeat.setSeat(
                    seat
            );

            bookingSeat.setPrice(
                    seat.getPrice()
            );


            bookingSeats.add(
                    bookingSeat
            );
        }


        bookingSeatRepository.saveAll(
                bookingSeats
        );


        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        return buildBookingResponse(
                savedBooking,
                bookingSeats
        );
    }


    // =====================================================
    // MY BOOKINGS
    // =====================================================

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings() {

        User user =
                getCurrentUser();


        List<Booking> bookings =
                bookingRepository.findByUserId(
                        user.getId()
                );


        List<BookingResponse> responses =
                new ArrayList<>();


        for (Booking booking :
                bookings) {

            List<BookingSeat> bookingSeats =
                    getBookingSeats(
                            booking.getId()
                    );


            responses.add(
                    buildBookingResponse(
                            booking,
                            bookingSeats
                    )
            );
        }


        return responses;
    }


    // =====================================================
    // GET BOOKING
    // =====================================================

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(
            Long id) {

        User user =
                getCurrentUser();


        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found with id: "
                                                + id
                                )
                        );


        if (!booking.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You are not allowed to view this booking"
            );
        }


        List<BookingSeat> bookingSeats =
                getBookingSeats(
                        booking.getId()
                );


        return buildBookingResponse(
                booking,
                bookingSeats
        );
    }


    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    @Transactional
    public BookingResponse cancelBooking(
            Long id) {

        User user =
                getCurrentUser();


        Booking booking =
                bookingRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found with id: "
                                                + id
                                )
                        );


        if (!booking.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You are not allowed to cancel this booking"
            );
        }


        if (booking.getStatus()
                == Booking.BookingStatus.CANCELLED) {

            throw new IllegalArgumentException(
                    "Booking is already cancelled"
            );
        }


        booking.setStatus(
                Booking.BookingStatus.CANCELLED
        );


        Booking savedBooking =
                bookingRepository.save(
                        booking
                );


        List<BookingSeat> bookingSeats =
                getBookingSeats(
                        savedBooking.getId()
                );


        return buildBookingResponse(
                savedBooking,
                bookingSeats
        );
    }


    // =====================================================
    // GET BOOKING SEATS
    // =====================================================

    private List<BookingSeat> getBookingSeats(
            Long bookingId) {

        return bookingSeatRepository
                .findAll()
                .stream()
                .filter(
                        bookingSeat ->
                                bookingSeat
                                        .getBooking()
                                        .getId()
                                        .equals(
                                                bookingId
                                        )
                )
                .toList();
    }


    // =====================================================
    // CURRENT USER
    // =====================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null
                || !authentication.isAuthenticated()) {

            throw new IllegalArgumentException(
                    "User is not authenticated"
            );
        }


        String email =
                authentication.getName();


        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }


    // =====================================================
    // BOOKING REFERENCE
    // =====================================================

    private String generateBookingReference() {

        return "BK-"
                + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 10)
                        .toUpperCase();
    }


    // =====================================================
    // BUILD RESPONSE
    // =====================================================

    private BookingResponse buildBookingResponse(
            Booking booking,
            List<BookingSeat> bookingSeats) {


        List<String> seats =
                new ArrayList<>();


        for (BookingSeat bookingSeat :
                bookingSeats) {

            seats.add(
                    bookingSeat
                            .getSeat()
                            .getSeatNumber()
            );
        }


        return new BookingResponse(

                booking.getId(),

                booking.getBookingReference(),

                booking.getShow()
                        .getEvent()
                        .getTitle(),

                booking.getShow()
                        .getVenue()
                        .getName(),

                booking.getShow()
                        .getShowDate(),

                booking.getShow()
                        .getStartTime(),

                seats,

                booking.getTotalAmount(),

                booking.getStatus()
                        .name(),

                booking.getBookingDate()
        );
    }


    // =====================================================
    // RESPONSE DTO
    // =====================================================

    public record BookingResponse(

            Long bookingId,

            String bookingReference,

            String eventTitle,

            String venueName,

            java.time.LocalDate showDate,

            java.time.LocalTime startTime,

            List<String> seats,

            BigDecimal totalAmount,

            String status,

            LocalDateTime bookingDate

    ) {
    }

}