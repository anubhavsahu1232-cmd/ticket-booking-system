package com.ticketbooking.backend.controller;

import com.ticketbooking.backend.dto.TicketResponse;
import com.ticketbooking.backend.service.TicketService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(
            TicketService ticketService) {

        this.ticketService = ticketService;
    }

    @PostMapping("/booking/{bookingId}")
    public ResponseEntity<TicketResponse> generateTicket(
            @PathVariable Long bookingId) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        ticketService.generateTicket(
                                bookingId
                        )
                );
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<TicketResponse> getTicket(
            @PathVariable Long bookingId) {

        return ResponseEntity.ok(
                ticketService.getTicket(
                        bookingId
                )
        );
    }
}