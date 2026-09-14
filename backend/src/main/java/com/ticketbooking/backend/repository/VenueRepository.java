package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long> {
}