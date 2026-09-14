import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";

import adminService from "../../services/adminService";


const ManageBookings = () => {

    const [bookings, setBookings] =
        useState([]);

    const [selectedBooking, setSelectedBooking] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [loadingDetails, setLoadingDetails] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD ALL BOOKINGS
    // ==========================================

    const loadBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await adminService.getAllBookings();

            setBookings(data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load bookings"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadBookings();

    }, []);


    // ==========================================
    // VIEW BOOKING DETAILS
    // ==========================================

    const handleViewDetails = async (id) => {

        try {

            setLoadingDetails(true);
            setError("");

            const data =
                await adminService.getBookingById(id);

            setSelectedBooking(data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load booking details"
            );

        } finally {

            setLoadingDetails(false);

        }

    };


    // ==========================================
    // CLOSE DETAILS
    // ==========================================

    const handleCloseDetails = () => {

        setSelectedBooking(null);

    };


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {

        if (status === "CONFIRMED") {
            return "booking-status confirmed";
        }

        if (status === "CANCELLED") {
            return "booking-status cancelled";
        }

        return "booking-status pending";

    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // ==========================================
    // FORMAT DATE TIME
    // ==========================================

    const formatDateTime = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    return (

        <div>

            <Navbar />


            <main className="admin-container">

                {/* ====================================== */}
                {/* HEADER */}
                {/* ====================================== */}

                <div className="admin-page-header">

                    <div>

                        <h1>
                            Manage Bookings
                        </h1>

                        <p>
                            View and manage all customer
                            bookings.
                        </p>

                    </div>

                </div>


                {/* ====================================== */}
                {/* ERROR */}
                {/* ====================================== */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                {/* ====================================== */}
                {/* BOOKING COUNT */}
                {/* ====================================== */}

                <div className="booking-summary">

                    <div>

                        <strong>
                            {bookings.length}
                        </strong>

                        <span>
                            Total Bookings
                        </span>

                    </div>

                </div>


                {/* ====================================== */}
                {/* BOOKINGS */}
                {/* ====================================== */}

                <section className="admin-list-section">

                    <div className="admin-list-header">

                        <h2>
                            All Bookings
                        </h2>

                    </div>


                    {loading ? (

                        <div className="loading">

                            Loading bookings...

                        </div>

                    ) : bookings.length === 0 ? (

                        <div className="empty-state">

                            No bookings found.

                        </div>

                    ) : (

                        <div className="booking-table-container">

                            <table className="booking-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Booking Ref
                                        </th>

                                        <th>
                                            Event
                                        </th>

                                        <th>
                                            Venue
                                        </th>

                                        <th>
                                            Show Date
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {bookings.map(
                                        (booking) => (

                                            <tr
                                                key={
                                                    booking.id
                                                }
                                            >

                                                <td>

                                                    <strong>
                                                        {
                                                            booking.bookingReference
                                                        }
                                                    </strong>

                                                </td>


                                                <td>

                                                    {booking.show
                                                        ?.event
                                                        ?.title ||
                                                        "N/A"}

                                                </td>


                                                <td>

                                                    {booking.show
                                                        ?.venue
                                                        ?.name ||
                                                        "N/A"}

                                                </td>


                                                <td>

                                                    {formatDate(
                                                        booking.show
                                                            ?.showDate
                                                    )}

                                                </td>


                                                <td>

                                                    ₹
                                                    {Number(
                                                        booking.totalAmount ||
                                                        0
                                                    ).toFixed(2)}

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            getStatusClass(
                                                                booking.status
                                                            )
                                                        }
                                                    >

                                                        {
                                                            booking.status
                                                        }

                                                    </span>

                                                </td>


                                                <td>

                                                    <button
                                                        className="view-details-button"
                                                        onClick={() =>
                                                            handleViewDetails(
                                                                booking.id
                                                            )
                                                        }
                                                    >

                                                        View Details

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>


                {/* ====================================== */}
                {/* BOOKING DETAILS */}
                {/* ====================================== */}

                {selectedBooking && (

                    <div className="booking-details-overlay">

                        <div className="booking-details-modal">

                            <div className="booking-details-header">

                                <div>

                                    <h2>
                                        Booking Details
                                    </h2>

                                    <p>
                                        {
                                            selectedBooking.bookingReference
                                        }
                                    </p>

                                </div>


                                <button
                                    className="close-modal-button"
                                    onClick={
                                        handleCloseDetails
                                    }
                                >

                                    ✕

                                </button>

                            </div>


                            {/* BOOKING INFORMATION */}

                            <div className="booking-detail-grid">

                                <div className="detail-item">

                                    <span>
                                        Booking ID
                                    </span>

                                    <strong>
                                        {
                                            selectedBooking.id
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Booking Reference
                                    </span>

                                    <strong>
                                        {
                                            selectedBooking.bookingReference
                                        }
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Status
                                    </span>

                                    <strong
                                        className={
                                            getStatusClass(
                                                selectedBooking.status
                                            )
                                        }
                                    >

                                        {
                                            selectedBooking.status
                                        }

                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            selectedBooking.totalAmount ||
                                            0
                                        ).toFixed(2)}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Booking Date
                                    </span>

                                    <strong>
                                        {
                                            formatDateTime(
                                                selectedBooking.bookingDate
                                            )
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* USER */}

                            <div className="detail-section">

                                <h3>
                                    Customer Information
                                </h3>

                                <div className="detail-box">

                                    <p>

                                        <strong>
                                            Name:
                                        </strong>{" "}

                                        {
                                            selectedBooking.user
                                                ?.name ||
                                            "N/A"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Email:
                                        </strong>{" "}

                                        {
                                            selectedBooking.user
                                                ?.email ||
                                            "N/A"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Role:
                                        </strong>{" "}

                                        {
                                            selectedBooking.user
                                                ?.role ||
                                            "USER"
                                        }

                                    </p>

                                </div>

                            </div>


                            {/* EVENT */}

                            <div className="detail-section">

                                <h3>
                                    Show Information
                                </h3>

                                <div className="detail-box">

                                    <p>

                                        <strong>
                                            Event:
                                        </strong>{" "}

                                        {
                                            selectedBooking.show
                                                ?.event
                                                ?.title ||
                                            "N/A"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Venue:
                                        </strong>{" "}

                                        {
                                            selectedBooking.show
                                                ?.venue
                                                ?.name ||
                                            "N/A"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            City:
                                        </strong>{" "}

                                        {
                                            selectedBooking.show
                                                ?.venue
                                                ?.city ||
                                            "N/A"
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Date:
                                        </strong>{" "}

                                        {
                                            formatDate(
                                                selectedBooking.show
                                                    ?.showDate
                                            )
                                        }

                                    </p>


                                    <p>

                                        <strong>
                                            Time:
                                        </strong>{" "}

                                        {
                                            selectedBooking.show
                                                ?.startTime ||
                                            "N/A"
                                        }

                                        {" - "}

                                        {
                                            selectedBooking.show
                                                ?.endTime ||
                                            "N/A"
                                        }

                                    </p>

                                </div>

                            </div>


                            {/* SEATS */}

                            <div className="detail-section">

                                <h3>
                                    Booked Seats
                                </h3>

                                <div className="admin-booked-seats">

                                    {selectedBooking.bookingSeats
                                        ?.length > 0 ? (

                                        selectedBooking.bookingSeats.map(
                                            (bookingSeat) => (

                                                <div
                                                    className="admin-booked-seat"
                                                    key={
                                                        bookingSeat.id
                                                    }
                                                >

                                                    <strong>
                                                        {
                                                            bookingSeat
                                                                .seat
                                                                ?.seatNumber ||
                                                            "N/A"
                                                        }
                                                    </strong>

                                                    <span>

                                                        {
                                                            bookingSeat
                                                                .seat
                                                                ?.seatType ||
                                                            "REGULAR"
                                                        }

                                                    </span>

                                                    <span>

                                                        ₹
                                                        {Number(
                                                            bookingSeat.price ||
                                                            0
                                                        ).toFixed(2)}

                                                    </span>

                                                </div>

                                            )
                                        )

                                    ) : (

                                        <p>
                                            No seat information
                                            available.
                                        </p>

                                    )}

                                </div>

                            </div>


                            <div className="modal-footer">

                                <button
                                    className="admin-secondary-button"
                                    onClick={
                                        handleCloseDetails
                                    }
                                >

                                    Close

                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {loadingDetails && (

                    <div className="loading-overlay">

                        <div className="loading">

                            Loading booking details...

                        </div>

                    </div>

                )}

            </main>

        </div>

    );

};

export default ManageBookings;