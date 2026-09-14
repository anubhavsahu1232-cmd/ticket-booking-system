package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.dto.VenueRequest;
import com.ticketbooking.backend.entity.Venue;
import com.ticketbooking.backend.service.VenueService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {

    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {

        return ResponseEntity.ok(
                venueService.getAllVenues()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                venueService.getVenueById(id)
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> createVenue(
            @Valid @RequestBody VenueRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(venueService.createVenue(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> updateVenue(
            @PathVariable Long id,
            @Valid @RequestBody VenueRequest request) {

        return ResponseEntity.ok(
                venueService.updateVenue(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVenue(
            @PathVariable Long id) {

        venueService.deleteVenue(id);

        return ResponseEntity.noContent().build();
    }
}