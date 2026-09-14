package com.ticketbooking.backend.service;

import com.ticketbooking.backend.dto.ShowRequest;
import com.ticketbooking.backend.entity.Event;
import com.ticketbooking.backend.entity.Show;
import com.ticketbooking.backend.entity.Venue;
import com.ticketbooking.backend.repository.EventRepository;
import com.ticketbooking.backend.repository.ShowRepository;
import com.ticketbooking.backend.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    public ShowService(
            ShowRepository showRepository,
            EventRepository eventRepository,
            VenueRepository venueRepository) {

        this.showRepository = showRepository;
        this.eventRepository = eventRepository;
        this.venueRepository = venueRepository;
    }

    public List<Show> getAllShows() {
        return showRepository.findAll();
    }

    public Show getShowById(Long id) {

        return showRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Show not found with id: " + id
                        ));
    }

    public List<Show> getShowsByEvent(Long eventId) {

        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException(
                    "Event not found with id: " + eventId
            );
        }

        return showRepository.findByEventId(eventId);
    }

    public List<Show> getShowsByDate(LocalDate date) {

        return showRepository.findByShowDate(date);
    }

    public Show createShow(ShowRequest request) {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Event not found with id: "
                                        + request.getEventId()
                        ));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Venue not found with id: "
                                        + request.getVenueId()
                        ));

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        Show show = new Show();

        show.setEvent(event);
        show.setVenue(venue);
        show.setShowDate(request.getShowDate());
        show.setStartTime(request.getStartTime());
        show.setEndTime(request.getEndTime());

        return showRepository.save(show);
    }

    public Show updateShow(Long id, ShowRequest request) {

        Show show = getShowById(id);

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Event not found with id: "
                                        + request.getEventId()
                        ));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Venue not found with id: "
                                        + request.getVenueId()
                        ));

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new IllegalArgumentException(
                    "End time must be after start time"
            );
        }

        show.setEvent(event);
        show.setVenue(venue);
        show.setShowDate(request.getShowDate());
        show.setStartTime(request.getStartTime());
        show.setEndTime(request.getEndTime());

        return showRepository.save(show);
    }

    public void deleteShow(Long id) {

        Show show = getShowById(id);

        showRepository.delete(show);
    }
}