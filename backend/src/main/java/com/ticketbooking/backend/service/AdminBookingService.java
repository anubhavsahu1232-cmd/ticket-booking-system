package com.ticketbooking.backend.service;

import com.ticketbooking.backend.entity.Booking;
import com.ticketbooking.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminBookingService {

    private final BookingRepository bookingRepository;

    public AdminBookingService(
            BookingRepository bookingRepository) {

        this.bookingRepository = bookingRepository;
    }

    // ==========================================
    // GET ALL BOOKINGS
    // ==========================================

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    // ==========================================
    // GET BOOKING BY ID
    // ==========================================

    public Booking getBookingById(Long id) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Booking not found with id: " + id
                        ));
    }
}