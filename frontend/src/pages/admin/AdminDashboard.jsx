import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import adminService from "../../services/adminService";

const AdminDashboard = () => {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const data =
                    await adminService.getDashboard();

                setDashboard(data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard"
                );

            } finally {

                setLoading(false);
            }
        };

        loadDashboard();

    }, []);

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="loading">
                    Loading admin dashboard...
                </div>
            </>
        );
    }

    if (error) {

        return (
            <>
                <Navbar />

                <main className="page-container">

                    <div className="error-message">
                        {error}
                    </div>

                </main>
            </>
        );
    }

    return (
        <div>

            <Navbar />

            <main className="admin-container">

                <div className="admin-header">

                    <div>
                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Manage your ticket booking system
                        </p>
                    </div>

                </div>

                {/* Statistics */}

                <div className="dashboard-stats">

                    <div className="stat-card">

                        <div className="stat-icon">
                            👥
                        </div>

                        <div>
                            <span>
                                Total Users
                            </span>

                            <strong>
                                {dashboard?.totalUsers ?? 0}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            🎬
                        </div>

                        <div>
                            <span>
                                Total Events
                            </span>

                            <strong>
                                {dashboard?.totalEvents ?? 0}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            🏢
                        </div>

                        <div>
                            <span>
                                Total Venues
                            </span>

                            <strong>
                                {dashboard?.totalVenues ?? 0}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            📅
                        </div>

                        <div>
                            <span>
                                Total Shows
                            </span>

                            <strong>
                                {dashboard?.totalShows ?? 0}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            🎟️
                        </div>

                        <div>
                            <span>
                                Total Bookings
                            </span>

                            <strong>
                                {dashboard?.totalBookings ?? 0}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            ✅
                        </div>

                        <div>
                            <span>
                                Confirmed
                            </span>

                            <strong>
                                {dashboard?.confirmedBookings ?? 0}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            ❌
                        </div>

                        <div>
                            <span>
                                Cancelled
                            </span>

                            <strong>
                                {dashboard?.cancelledBookings ?? 0}
                            </strong>
                        </div>

                    </div>

                    <div className="stat-card revenue-card">

                        <div className="stat-icon">
                            💰
                        </div>

                        <div>
                            <span>
                                Total Revenue
                            </span>

                            <strong>
                                ₹{Number(
                                    dashboard?.totalRevenue ?? 0
                                ).toFixed(2)}
                            </strong>
                        </div>

                    </div>

                </div>

                {/* Management */}

                <section className="admin-management">

                    <h2>
                        Management
                    </h2>

                    <div className="management-grid">

                        <Link
                            to="/admin/events"
                            className="management-card"
                        >
                            <div className="management-icon">
                                🎬
                            </div>

                            <h3>
                                Manage Events
                            </h3>

                            <p>
                                Add, update and delete events
                            </p>
                        </Link>

                        <Link
                            to="/admin/venues"
                            className="management-card"
                        >
                            <div className="management-icon">
                                🏢
                            </div>

                            <h3>
                                Manage Venues
                            </h3>

                            <p>
                                Manage theatres and venues
                            </p>
                        </Link>

                        <Link
                            to="/admin/shows"
                            className="management-card"
                        >
                            <div className="management-icon">
                                📅
                            </div>

                            <h3>
                                Manage Shows
                            </h3>

                            <p>
                                Schedule and manage shows
                            </p>
                        </Link>

                        <Link
                            to="/admin/bookings"
                            className="management-card"
                        >
                            <div className="management-icon">
                                🎟️
                            </div>

                            <h3>
                                Manage Bookings
                            </h3>

                            <p>
                                View all customer bookings
                            </p>
                        </Link>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default AdminDashboard;