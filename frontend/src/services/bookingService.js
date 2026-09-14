import api from "./api";

const bookingService = {

    createBooking: async (showId, seatIds) => {
        const response = await api.post("/bookings", {
            showId,
            seatIds,
        });

        return response.data;
    },

    getMyBookings: async () => {
        const response = await api.get("/bookings/my");
        return response.data;
    },

    getBookingById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    cancelBooking: async (id) => {
        const response = await api.put(
            `/bookings/${id}/cancel`
        );

        return response.data;
    },

};

export default bookingService;