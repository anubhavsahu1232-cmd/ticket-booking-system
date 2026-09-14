package com.ticketbooking.backend.service;

import com.ticketbooking.backend.dto.VenueRequest;
import com.ticketbooking.backend.entity.Venue;
import com.ticketbooking.backend.repository.VenueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueService(VenueRepository venueRepository) {
        this.venueRepository = venueRepository;
    }

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Venue getVenueById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Venue not found with id: " + id
                        ));
    }

    public Venue createVenue(VenueRequest request) {

        Venue venue = new Venue();

        venue.setName(request.getName());
        venue.setAddress(request.getAddress());
        venue.setCity(request.getCity());
        venue.setTotalSeats(request.getTotalSeats());

        return venueRepository.save(venue);
    }

    public Venue updateVenue(Long id, VenueRequest request) {

        Venue venue = getVenueById(id);

        venue.setName(request.getName());
        venue.setAddress(request.getAddress());
        venue.setCity(request.getCity());
        venue.setTotalSeats(request.getTotalSeats());

        return venueRepository.save(venue);
    }

    public void deleteVenue(Long id) {

        Venue venue = getVenueById(id);

        venueRepository.delete(venue);
    }
}