package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.dto.BookingRequest;
import com.ticketbooking.backend.service.BookingService;
import com.ticketbooking.backend.service.BookingService.BookingResponse;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {

        this.bookingService = bookingService;
    }

    // Create booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request) {

        BookingResponse response =
                bookingService.createBooking(
                        request.getShowId(),
                        request.getSeatIds()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get my bookings
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>>
    getMyBookings() {

        return ResponseEntity.ok(
                bookingService.getMyBookings()
        );
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse>
    getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.getBookingById(id)
        );
    }

    // Cancel booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse>
    cancelBooking(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(id)
        );
    }
}