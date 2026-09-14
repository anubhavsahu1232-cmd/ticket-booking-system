package com.ticketbooking.backend.service;

import com.ticketbooking.backend.entity.Booking;
import com.ticketbooking.backend.entity.Payment;
import com.ticketbooking.backend.repository.BookingRepository;
import com.ticketbooking.backend.repository.PaymentRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final TicketService ticketService;

    public PaymentService(
            PaymentRepository paymentRepository,
            BookingRepository bookingRepository,
            TicketService ticketService) {

        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.ticketService = ticketService;
    }


    // =====================================================
    // MAKE PAYMENT
    // =====================================================

    @Transactional
    public PaymentResponse makePayment(
            Long bookingId,
            String paymentMethod) {

        // ---------------------------------------------
        // Get current authenticated user
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Find booking
        // ---------------------------------------------

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Booking not found with id: "
                                                + bookingId
                                )
                        );


        // ---------------------------------------------
        // Check booking belongs to current user
        // ---------------------------------------------

        String email =
                authentication.getName();

        if (!booking.getUser()
                .getEmail()
                .equals(email)) {

            throw new IllegalArgumentException(
                    "You are not allowed to pay for this booking"
            );
        }


        // ---------------------------------------------
        // Check booking status
        // ---------------------------------------------

        if (booking.getStatus()
                == Booking.BookingStatus.CANCELLED) {

            throw new IllegalArgumentException(
                    "Booking is already cancelled"
            );
        }


        if (booking.getStatus()
                == Booking.BookingStatus.CONFIRMED) {

            throw new IllegalArgumentException(
                    "Booking is already confirmed"
            );
        }


        // ---------------------------------------------
        // Check payment time limit
        // ---------------------------------------------

        LocalDateTime expiryTime =
                booking.getBookingDate()
                        .plusMinutes(10);

        if (LocalDateTime.now()
                .isAfter(expiryTime)) {

            booking.setStatus(
                    Booking.BookingStatus.CANCELLED
            );

            bookingRepository.save(booking);

            throw new IllegalArgumentException(
                    "Booking payment time has expired"
            );
        }


        // ---------------------------------------------
        // Validate payment method
        // ---------------------------------------------

        if (paymentMethod == null
                || paymentMethod.isBlank()) {

            throw new IllegalArgumentException(
                    "Payment method is required"
            );
        }


        String normalizedPaymentMethod =
                paymentMethod
                        .trim()
                        .toUpperCase();


        if (!normalizedPaymentMethod.equals("UPI")
                && !normalizedPaymentMethod.equals("CARD")
                && !normalizedPaymentMethod.equals("NET_BANKING")
                && !normalizedPaymentMethod.equals("CASH")) {

            throw new IllegalArgumentException(
                    "Invalid payment method"
            );
        }


        // ---------------------------------------------
        // Check if payment already exists
        // ---------------------------------------------

        if (paymentRepository
                .findByBookingId(bookingId)
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Payment already exists for this booking"
            );
        }


        // ---------------------------------------------
        // Create payment
        // ---------------------------------------------

        Payment payment =
                new Payment();

        payment.setBooking(booking);

        payment.setTransactionId(
                generateTransactionId()
        );

        payment.setAmount(
                booking.getTotalAmount()
        );

        payment.setPaymentMethod(
                normalizedPaymentMethod
        );

        payment.setStatus(
                Payment.PaymentStatus.SUCCESS
        );

        payment.setPaymentDate(
                LocalDateTime.now()
        );


        Payment savedPayment =
                paymentRepository.save(payment);


        // ---------------------------------------------
        // Confirm booking
        // ---------------------------------------------

        booking.setStatus(
                Booking.BookingStatus.CONFIRMED
        );

        bookingRepository.save(booking);


        // ---------------------------------------------
        // Generate ticket
        // ---------------------------------------------

        try {

            ticketService.generateTicket(
                    bookingId
            );

        } catch (Exception exception) {

            throw new IllegalArgumentException(
                    "Payment successful but ticket generation failed"
            );
        }


        // ---------------------------------------------
        // Return response
        // ---------------------------------------------

        return new PaymentResponse(

                savedPayment.getId(),

                savedPayment
                        .getBooking()
                        .getId(),

                savedPayment
                        .getTransactionId(),

                savedPayment
                        .getAmount(),

                savedPayment
                        .getPaymentMethod(),

                savedPayment
                        .getStatus()
                        .name(),

                savedPayment
                        .getPaymentDate()
        );
    }


    // =====================================================
    // GET PAYMENT BY BOOKING ID
    // =====================================================

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBookingId(
            Long bookingId) {

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


        Payment payment =
                paymentRepository
                        .findByBookingId(bookingId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Payment not found for booking: "
                                                + bookingId
                                )
                        );


        if (!payment.getBooking()
                .getUser()
                .getEmail()
                .equals(email)) {

            throw new IllegalArgumentException(
                    "You are not allowed to view this payment"
            );
        }


        return new PaymentResponse(

                payment.getId(),

                payment.getBooking().getId(),

                payment.getTransactionId(),

                payment.getAmount(),

                payment.getPaymentMethod(),

                payment.getStatus().name(),

                payment.getPaymentDate()
        );
    }


    // =====================================================
    // TRANSACTION ID
    // =====================================================

    private String generateTransactionId() {

        return "TXN-"
                + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12)
                        .toUpperCase();
    }


    // =====================================================
    // RESPONSE DTO
    // =====================================================

    public record PaymentResponse(

            Long paymentId,

            Long bookingId,

            String transactionId,

            java.math.BigDecimal amount,

            String paymentMethod,

            String status,

            LocalDateTime paymentDate

    ) {
    }

}