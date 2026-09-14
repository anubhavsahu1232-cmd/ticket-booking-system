import api from "./api";

const eventService = {

    // Get all events
    getAllEvents: async () => {
        const response = await api.get("/events");
        return response.data;
    },

    // Get event by ID
    getEventById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    // Create event
    createEvent: async (eventData) => {
        const response = await api.post(
            "/events",
            eventData
        );

        return response.data;
    },

    // Update event
    updateEvent: async (id, eventData) => {
        const response = await api.put(
            `/events/${id}`,
            eventData
        );

        return response.data;
    },

    // Delete event
    deleteEvent: async (id) => {
        const response = await api.delete(
            `/events/${id}`
        );

        return response.data;
    },

};

export default eventService;