package com.ticketbooking.backend.service;

import com.ticketbooking.backend.dto.EventRequest;
import com.ticketbooking.backend.entity.Event;
import com.ticketbooking.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Event not found with id: " + id));
    }

    public Event createEvent(EventRequest request) {

        Event event = new Event();

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setLanguage(request.getLanguage());
        event.setDurationMinutes(request.getDurationMinutes());
        event.setPosterUrl(request.getPosterUrl());

        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, EventRequest request) {

        Event event = getEventById(id);

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setLanguage(request.getLanguage());
        event.setDurationMinutes(request.getDurationMinutes());
        event.setPosterUrl(request.getPosterUrl());

        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {

        Event event = getEventById(id);

        eventRepository.delete(event);
    }
}