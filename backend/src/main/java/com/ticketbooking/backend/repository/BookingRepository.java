package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    // ==========================================
    // USER BOOKINGS
    // ==========================================

    List<Booking> findByUserId(Long userId);


    // ==========================================
    // BOOKING REFERENCE
    // ==========================================

    Optional<Booking> findByBookingReference(
            String bookingReference
    );


    // ==========================================
    // EXPIRED PENDING BOOKINGS
    // ==========================================

    @Modifying
    @Query("""
        UPDATE Booking b
        SET b.status = 'CANCELLED'
        WHERE b.status = 'PENDING'
        AND b.bookingDate < :expiryTime
        """)
    int cancelExpiredPendingBookings(
            @Param("expiryTime")
            LocalDateTime expiryTime
    );

}