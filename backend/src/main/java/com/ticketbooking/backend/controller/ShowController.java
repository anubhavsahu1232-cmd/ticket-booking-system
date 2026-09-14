package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.dto.ShowRequest;
import com.ticketbooking.backend.entity.Show;
import com.ticketbooking.backend.service.ShowService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
public class ShowController {

    private final ShowService showService;

    public ShowController(ShowService showService) {
        this.showService = showService;
    }

    @GetMapping
    public ResponseEntity<List<Show>> getAllShows() {

        return ResponseEntity.ok(
                showService.getAllShows()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Show> getShowById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                showService.getShowById(id)
        );
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Show>> getShowsByEvent(
            @PathVariable Long eventId) {

        return ResponseEntity.ok(
                showService.getShowsByEvent(eventId)
        );
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Show>> getShowsByDate(
            @PathVariable LocalDate date) {

        return ResponseEntity.ok(
                showService.getShowsByDate(date)
        );
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Show> createShow(
            @Valid @RequestBody ShowRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(showService.createShow(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Show> updateShow(
            @PathVariable Long id,
            @Valid @RequestBody ShowRequest request) {

        return ResponseEntity.ok(
                showService.updateShow(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteShow(
            @PathVariable Long id) {

        showService.deleteShow(id);

        return ResponseEntity.noContent().build();
    }
}