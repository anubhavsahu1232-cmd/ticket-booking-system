package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.entity.Seat;
import com.ticketbooking.backend.service.SeatService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<Seat>> getSeatsByVenue(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                seatService.getSeatsByVenue(venueId)
        );
    }

    @GetMapping("/show/{showId}")
    public ResponseEntity<List<SeatService.SeatAvailability>>
    getSeatAvailability(@PathVariable Long showId) {

        return ResponseEntity.ok(
                seatService.getSeatAvailability(showId)
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Seat> createSeat(
            @RequestParam Long venueId,
            @RequestParam String seatNumber,
            @RequestParam Seat.SeatType seatType,
            @RequestParam BigDecimal price) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        seatService.createSeat(
                                venueId,
                                seatNumber,
                                seatType,
                                price
                        )
                );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSeat(
            @PathVariable Long id) {

        seatService.deleteSeat(id);

        return ResponseEntity.noContent().build();
    }
}