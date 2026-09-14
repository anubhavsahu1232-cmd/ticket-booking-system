import api from "./api";

const adminService = {

    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    getDashboard: async () => {

        const response =
            await api.get("/admin/dashboard");

        return response.data;
    },


    // ==========================================
    // GET ALL BOOKINGS
    // ==========================================

    getAllBookings: async () => {

        const response =
            await api.get("/admin/bookings");

        return response.data;
    },


    // ==========================================
    // GET BOOKING BY ID
    // ==========================================

    getBookingById: async (id) => {

        const response =
            await api.get(
                `/admin/bookings/${id}`
            );

        return response.data;
    },

};

export default adminService;