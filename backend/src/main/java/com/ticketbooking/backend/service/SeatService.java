package com.ticketbooking.backend.service;

import com.ticketbooking.backend.entity.BookingSeat;
import com.ticketbooking.backend.entity.Seat;
import com.ticketbooking.backend.entity.Show;
import com.ticketbooking.backend.entity.Venue;

import com.ticketbooking.backend.repository.BookingRepository;
import com.ticketbooking.backend.repository.BookingSeatRepository;
import com.ticketbooking.backend.repository.SeatRepository;
import com.ticketbooking.backend.repository.ShowRepository;
import com.ticketbooking.backend.repository.VenueRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final VenueRepository venueRepository;
    private final ShowRepository showRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingRepository bookingRepository;

    public SeatService(
            SeatRepository seatRepository,
            VenueRepository venueRepository,
            ShowRepository showRepository,
            BookingSeatRepository bookingSeatRepository,
            BookingRepository bookingRepository) {

        this.seatRepository = seatRepository;
        this.venueRepository = venueRepository;
        this.showRepository = showRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.bookingRepository = bookingRepository;
    }

    // ==========================================
    // GET SEATS BY VENUE
    // ==========================================

    public List<Seat> getSeatsByVenue(
            Long venueId) {

        if (!venueRepository.existsById(venueId)) {

            throw new IllegalArgumentException(
                    "Venue not found with id: "
                            + venueId
            );
        }

        return seatRepository.findByVenueId(
                venueId
        );
    }

    // ==========================================
    // CREATE SEAT
    // ==========================================

    public Seat createSeat(
            Long venueId,
            String seatNumber,
            Seat.SeatType seatType,
            BigDecimal price) {

        Venue venue =
                venueRepository.findById(venueId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Venue not found with id: "
                                                + venueId
                                ));

        if (seatNumber == null
                || seatNumber.isBlank()) {

            throw new IllegalArgumentException(
                    "Seat number is required"
            );
        }

        if (seatType == null) {

            throw new IllegalArgumentException(
                    "Seat type is required"
            );
        }

        if (price == null
                || price.compareTo(
                        BigDecimal.ZERO
                ) <= 0) {

            throw new IllegalArgumentException(
                    "Seat price must be greater than zero"
            );
        }

        Seat seat = new Seat();

        seat.setVenue(venue);
        seat.setSeatNumber(
                seatNumber.trim().toUpperCase()
        );
        seat.setSeatType(seatType);
        seat.setPrice(price);

        return seatRepository.save(seat);
    }

    // ==========================================
    // DELETE SEAT
    // ==========================================

    public void deleteSeat(Long id) {

        Seat seat =
                seatRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Seat not found with id: "
                                                + id
                                ));

        seatRepository.delete(seat);
    }

    // ==========================================
    // GET SEAT AVAILABILITY
    // ==========================================

    @Transactional
    public List<SeatAvailability> getSeatAvailability(
            Long showId) {

        Show show =
                showRepository.findById(showId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Show not found with id: "
                                                + showId
                                ));

        // Expire old pending bookings
        LocalDateTime expiryTime =
                LocalDateTime.now()
                        .minusMinutes(10);

        bookingRepository
                .cancelExpiredPendingBookings(
                        expiryTime
                );

        Long venueId =
                show.getVenue().getId();

        List<Seat> seats =
                seatRepository.findByVenueId(
                        venueId
                );

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

        List<SeatAvailability> result =
                new ArrayList<>();

        for (Seat seat : seats) {

            String status =
                    bookedSeatIds.contains(
                            seat.getId()
                    )
                            ? "BOOKED"
                            : "AVAILABLE";

            result.add(
                    new SeatAvailability(
                            seat.getId(),
                            seat.getSeatNumber(),
                            seat.getSeatType().name(),
                            seat.getPrice(),
                            status
                    )
            );
        }

        return result;
    }

    // ==========================================
    // SEAT AVAILABILITY RESPONSE
    // ==========================================

    public record SeatAvailability(
            Long seatId,
            String seatNumber,
            String seatType,
            BigDecimal price,
            String status
    ) {
    }
}