import api from "./api";

const paymentService = {

    // ==========================================
    // MAKE PAYMENT
    // ==========================================

    makePayment: async (bookingId, paymentMethod) => {

        const response = await api.post(
            "/payments",
            {
                bookingId,
                paymentMethod,
            }
        );

        return response.data;
    },


    // ==========================================
    // GET PAYMENT BY BOOKING ID
    // ==========================================

    getPaymentByBookingId: async (bookingId) => {

        const response = await api.get(
            `/payments/booking/${bookingId}`
        );

        return response.data;
    },

};

export default paymentService;