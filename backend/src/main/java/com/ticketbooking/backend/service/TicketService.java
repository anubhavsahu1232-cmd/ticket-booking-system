package com.ticketbooking.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

import com.ticketbooking.backend.dto.TicketResponse;
import com.ticketbooking.backend.entity.Booking;
import com.ticketbooking.backend.entity.BookingSeat;
import com.ticketbooking.backend.entity.Payment;
import com.ticketbooking.backend.entity.Ticket;
import com.ticketbooking.backend.entity.User;
import com.ticketbooking.backend.repository.BookingRepository;
import com.ticketbooking.backend.repository.BookingSeatRepository;
import com.ticketbooking.backend.repository.PaymentRepository;
import com.ticketbooking.backend.repository.TicketRepository;
import com.ticketbooking.backend.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public TicketService(
            TicketRepository ticketRepository,
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository,
            PaymentRepository paymentRepository,
            UserRepository userRepository) {

        this.ticketRepository = ticketRepository;
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        }

    // ==========================================
    // GENERATE TICKET
    // ==========================================

    @Transactional
    public TicketResponse generateTicket(
            Long bookingId) {

        User user = getCurrentUser();

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found with id: "
                                                + bookingId
                                ));

        // Check ownership
        if (!booking.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You are not allowed to generate this ticket"
            );
        }

        // Booking must be confirmed
        if (booking.getStatus()
                != Booking.BookingStatus.CONFIRMED) {

            throw new IllegalArgumentException(
                    "Ticket can only be generated for confirmed booking"
            );
        }

        // Payment must be successful
        Payment payment =
                paymentRepository
                        .findByBookingId(bookingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Payment not found for this booking"
                                ));

        if (payment.getStatus()
                != Payment.PaymentStatus.SUCCESS) {

            throw new IllegalArgumentException(
                    "Ticket can only be generated after successful payment"
            );
        }

        // Check existing ticket
        if (ticketRepository
                .findByBookingId(bookingId)
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Ticket already exists for this booking"
            );
        }

        // Generate ticket number
        String ticketNumber =
                generateTicketNumber();

        // Generate QR data
        String qrData =
                createQrData(
                        booking,
                        ticketNumber
                );

        // Generate QR Base64
        String qrCode =
                generateQrCode(qrData);

        // Create ticket
        Ticket ticket = new Ticket();

        ticket.setBooking(booking);
        ticket.setTicketNumber(ticketNumber);
        ticket.setQrCode(qrCode);

        Ticket savedTicket =
                ticketRepository.save(ticket);

        return buildTicketResponse(
                savedTicket,
                booking,
                payment
        );
    }

    // ==========================================
    // GET TICKET
    // ==========================================

    @Transactional(readOnly = true)
    public TicketResponse getTicket(
            Long bookingId) {

        User user = getCurrentUser();

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found with id: "
                                                + bookingId
                                ));

        // Check ownership
        if (!booking.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You are not allowed to view this ticket"
            );
        }

        Ticket ticket =
                ticketRepository
                        .findByBookingId(bookingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Ticket not found for this booking"
                                ));

        Payment payment =
                paymentRepository
                        .findByBookingId(bookingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Payment not found for this booking"
                                ));

        return buildTicketResponse(
                ticket,
                booking,
                payment
        );
    }

    // ==========================================
    // BUILD RESPONSE
    // ==========================================

    private TicketResponse buildTicketResponse(
            Ticket ticket,
            Booking booking,
            Payment payment) {

        List<BookingSeat> bookingSeats =
                bookingSeatRepository
                        .findAll()
                        .stream()
                        .filter(bs ->
                                bs.getBooking()
                                        .getId()
                                        .equals(booking.getId()))
                        .toList();

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

        return new TicketResponse(
                ticket.getId(),
                booking.getId(),
                ticket.getTicketNumber(),
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

                booking.getStatus().name(),

                payment.getStatus().name(),

                ticket.getQrCode(),

                ticket.getGeneratedAt()
        );
    }

    // ==========================================
    // QR DATA
    // ==========================================

    private String createQrData(
            Booking booking,
            String ticketNumber) {

        return "TICKET="
                + ticketNumber
                + "|BOOKING="
                + booking.getBookingReference()
                + "|EVENT="
                + booking.getShow()
                        .getEvent()
                        .getTitle();
    }

    // ==========================================
    // GENERATE QR
    // ==========================================

    private String generateQrCode(
            String data) {

        try {

            BitMatrix matrix =
                    new MultiFormatWriter().encode(
                            data,
                            BarcodeFormat.QR_CODE,
                            300,
                            300
                    );

            ByteArrayOutputStream output =
                    new ByteArrayOutputStream();

            MatrixToImageWriter.writeToStream(
                    matrix,
                    "PNG",
                    output
            );

            return Base64.getEncoder()
                    .encodeToString(
                            output.toByteArray()
                    );

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Unable to generate QR code"
            );
        }
    }

    // ==========================================
    // TICKET NUMBER
    // ==========================================

    private String generateTicketNumber() {

        return "TKT-"
                + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12)
                        .toUpperCase();
    }

    // ==========================================
    // CURRENT USER
    // ==========================================

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
                        ));
    }
}