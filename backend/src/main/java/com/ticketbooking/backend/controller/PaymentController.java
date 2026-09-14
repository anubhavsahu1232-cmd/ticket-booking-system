package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.dto.PaymentRequest;
import com.ticketbooking.backend.service.PaymentService;
import com.ticketbooking.backend.service.PaymentService.PaymentResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;


    public PaymentController(
            PaymentService paymentService) {

        this.paymentService =
                paymentService;
    }


    // ==========================================
    // MAKE PAYMENT
    // ==========================================

    @PostMapping
    public ResponseEntity<PaymentResponse> makePayment(
            @RequestBody PaymentRequest request) {

        PaymentResponse response =
                paymentService.makePayment(
                        request.getBookingId(),
                        request.getPaymentMethod()
                );

        return ResponseEntity.ok(response);
    }


    // ==========================================
    // GET PAYMENT BY BOOKING ID
    // ==========================================

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getPaymentByBookingId(
            @PathVariable Long bookingId) {

        PaymentResponse response =
                paymentService.getPaymentByBookingId(
                        bookingId
                );

        return ResponseEntity.ok(response);
    }

}