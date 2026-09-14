package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.entity.Seat;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository
        extends JpaRepository<Seat, Long> {

    List<Seat> findByVenueId(Long venueId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT s
        FROM Seat s
        WHERE s.id IN :ids
        ORDER BY s.id
        """)
    List<Seat> findAllByIdsForUpdate(
            @Param("ids") List<Long> ids
    );

}