import api from "./api";

const venueService = {

    getAllVenues: async () => {
        const response = await api.get("/venues");
        return response.data;
    },

    getVenueById: async (id) => {
        const response = await api.get(`/venues/${id}`);
        return response.data;
    },

    createVenue: async (venueData) => {
        const response = await api.post(
            "/venues",
            venueData
        );

        return response.data;
    },

    deleteVenue: async (id) => {
        const response = await api.delete(
            `/venues/${id}`
        );

        return response.data;
    },
};

export default venueService;