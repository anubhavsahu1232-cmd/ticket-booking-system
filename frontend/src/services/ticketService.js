import api from "./api";

const ticketService = {

    getTicketByBookingId: async (bookingId) => {
        const response = await api.get(
            `/tickets/booking/${bookingId}`
        );

        return response.data;
    },

    generateTicket: async (bookingId) => {
        const response = await api.post(
            `/tickets/booking/${bookingId}`
        );

        return response.data;
    },

};

export default ticketService;