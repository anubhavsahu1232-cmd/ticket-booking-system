package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.entity.Booking;
import com.ticketbooking.backend.repository.BookingRepository;
import com.ticketbooking.backend.repository.EventRepository;
import com.ticketbooking.backend.repository.UserRepository;
import com.ticketbooking.backend.repository.VenueRepository;
import com.ticketbooking.backend.repository.ShowRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final ShowRepository showRepository;
    private final BookingRepository bookingRepository;

    public AdminDashboardController(
            UserRepository userRepository,
            EventRepository eventRepository,
            VenueRepository venueRepository,
            ShowRepository showRepository,
            BookingRepository bookingRepository) {

        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
        this.showRepository = showRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboard() {

        long totalUsers =
                userRepository.count();

        long totalEvents =
                eventRepository.count();

        long totalVenues =
                venueRepository.count();

        long totalShows =
                showRepository.count();

        long totalBookings =
                bookingRepository.count();

        long confirmedBookings =
                bookingRepository.findAll()
                        .stream()
                        .filter(booking ->
                                booking.getStatus()
                                        == Booking.BookingStatus.CONFIRMED)
                        .count();

        long cancelledBookings =
                bookingRepository.findAll()
                        .stream()
                        .filter(booking ->
                                booking.getStatus()
                                        == Booking.BookingStatus.CANCELLED)
                        .count();

        BigDecimal totalRevenue =
                bookingRepository.findAll()
                        .stream()
                        .filter(booking ->
                                booking.getStatus()
                                        == Booking.BookingStatus.CONFIRMED)
                        .map(Booking::getTotalAmount)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        Map<String, Object> dashboard =
                new HashMap<>();

        dashboard.put(
                "totalUsers",
                totalUsers
        );

        dashboard.put(
                "totalEvents",
                totalEvents
        );

        dashboard.put(
                "totalVenues",
                totalVenues
        );

        dashboard.put(
                "totalShows",
                totalShows
        );

        dashboard.put(
                "totalBookings",
                totalBookings
        );

        dashboard.put(
                "confirmedBookings",
                confirmedBookings
        );

        dashboard.put(
                "cancelledBookings",
                cancelledBookings
        );

        dashboard.put(
                "totalRevenue",
                totalRevenue
        );

        return ResponseEntity.ok(
                dashboard
        );
    }
}