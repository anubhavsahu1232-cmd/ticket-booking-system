import { Routes, Route } from "react-router-dom";

import Login from "../auth/Login";
import Register from "../auth/Register";

import Home from "../user/Home";
import Events from "../user/Events";
import EventDetails from "../user/EventDetails";
import SeatSelection from "../user/SeatSelection";
import Payment from "../user/Payment";
import Ticket from "../user/Ticket";
import MyBookings from "../user/MyBookings";

import AdminDashboard from "../admin/AdminDashboard";
import ManageEvents from "../admin/ManageEvents";
import ManageVenues from "../admin/ManageVenues";
import ManageShows from "../admin/ManageShows";

import ProtectedRoute from "../../components/ProtectedRoute";
import AdminRoute from "../../components/AdminRoute";

const AppRoutes = () => {
    return (
        <Routes>

            {/* ================= AUTH ================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* ================= USER ================= */}

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/events"
                element={
                    <ProtectedRoute>
                        <Events />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/events/:id"
                element={
                    <ProtectedRoute>
                        <EventDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/shows/:showId/seats"
                element={
                    <ProtectedRoute>
                        <SeatSelection />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/payment/:bookingId"
                element={
                    <ProtectedRoute>
                        <Payment />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/ticket/:bookingId"
                element={
                    <ProtectedRoute>
                        <Ticket />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/bookings"
                element={
                    <ProtectedRoute>
                        <MyBookings />
                    </ProtectedRoute>
                }
            />


            {/* ================= ADMIN ================= */}

            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/events"
                element={
                    <AdminRoute>
                        <ManageEvents />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/venues"
                element={
                    <AdminRoute>
                        <ManageVenues />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/shows"
                element={
                    <AdminRoute>
                        <ManageShows />
                    </AdminRoute>
                }
            />

        </Routes>
    );
};

export default AppRoutes;