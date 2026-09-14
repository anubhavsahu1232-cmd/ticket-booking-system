import api from "./api";

const seatService = {

    // Get seats of a venue
    getSeatsByVenue: async (venueId) => {
        const response = await api.get(
            `/seats/venue/${venueId}`
        );

        return response.data;
    },

    // Get seat availability for a show
    getSeatAvailability: async (showId) => {
        const response = await api.get(
            `/seats/show/${showId}`
        );

        return response.data;
    },

    // Create seat
    createSeat: async (
        venueId,
        seatNumber,
        seatType,
        price
    ) => {

        const response = await api.post(
            "/seats",
            null,
            {
                params: {
                    venueId,
                    seatNumber,
                    seatType,
                    price,
                },
            }
        );

        return response.data;
    },

    // Delete seat
    deleteSeat: async (id) => {
        const response = await api.delete(
            `/seats/${id}`
        );

        return response.data;
    },

};

export default seatService;