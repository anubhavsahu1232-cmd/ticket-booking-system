package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {
}