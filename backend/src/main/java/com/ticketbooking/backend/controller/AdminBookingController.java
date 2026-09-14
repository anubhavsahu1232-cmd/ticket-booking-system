package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.entity.Booking;
import com.ticketbooking.backend.service.AdminBookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    public AdminBookingController(
            AdminBookingService adminBookingService) {

        this.adminBookingService =
                adminBookingService;
    }

    // ==========================================
    // GET ALL BOOKINGS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Booking>>
    getAllBookings() {

        return ResponseEntity.ok(
                adminBookingService.getAllBookings()
        );
    }

    // ==========================================
    // GET BOOKING BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Booking>
    getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                adminBookingService.getBookingById(id)
        );
    }
}