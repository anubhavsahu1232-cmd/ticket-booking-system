package com.ticketbooking.backend.repository;

import com.ticketbooking.backend.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {

    List<Show> findByEventId(Long eventId);

    List<Show> findByShowDate(LocalDate showDate);
}