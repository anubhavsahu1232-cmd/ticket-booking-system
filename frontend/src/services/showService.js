import api from "./api";

const showService = {

    // Get all shows
    getAllShows: async () => {
        const response = await api.get("/shows");
        return response.data;
    },

    // Get shows by event
    getShowsByEvent: async (eventId) => {
        const response = await api.get(
            `/shows/event/${eventId}`
        );

        return response.data;
    },

    // Get show by ID
    getShowById: async (id) => {
        const response = await api.get(
            `/shows/${id}`
        );

        return response.data;
    },

    // Create show
    createShow: async (showData) => {
        const response = await api.post(
            "/shows",
            showData
        );

        return response.data;
    },

    // Update show
    updateShow: async (id, showData) => {
        const response = await api.put(
            `/shows/${id}`,
            showData
        );

        return response.data;
    },

    // Delete show
    deleteShow: async (id) => {
        const response = await api.delete(
            `/shows/${id}`
        );

        return response.data;
    },

};

export default showService;