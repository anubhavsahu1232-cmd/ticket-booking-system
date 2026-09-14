package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.entity.BookingSeat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingSeatRepository
        extends JpaRepository<BookingSeat, Long> {

    @Query("""
        SELECT bs
        FROM BookingSeat bs
        JOIN bs.booking b
        WHERE b.show.id = :showId
        AND (
            b.status = 'CONFIRMED'
            OR (
                b.status = 'PENDING'
                AND b.bookingDate >= :expiryTime
            )
        )
        """)
    List<BookingSeat> findBookedSeatsByShowId(
            @Param("showId") Long showId,
            @Param("expiryTime") LocalDateTime expiryTime
    );

    @Modifying
    @Query("""
        DELETE FROM BookingSeat bs
        WHERE bs.booking.id IN (
            SELECT b.id
            FROM Booking b
            WHERE b.status = 'CANCELLED'
        )
        """)
    int deleteSeatsOfCancelledBookings();

}