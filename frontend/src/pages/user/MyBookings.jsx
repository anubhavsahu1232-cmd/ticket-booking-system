import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";

import bookingService from "../../services/bookingService";


const MyBookings = () => {

    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [cancellingId, setCancellingId] =
        useState(null);


    // ==========================================
    // LOAD BOOKINGS
    // ==========================================

    const loadBookings = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await bookingService.getMyBookings();

            setBookings(data);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to load your bookings"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadBookings();

    }, []);


    // ==========================================
    // CANCEL BOOKING
    // ==========================================

    const handleCancel = async (bookingId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this booking?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setCancellingId(bookingId);

            setError("");
            setSuccess("");

            await bookingService.cancelBooking(
                bookingId
            );

            setSuccess(
                "Booking cancelled successfully."
            );

            await loadBookings();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to cancel booking"
            );

        } finally {

            setCancellingId(null);

        }

    };


    // ==========================================
    // VIEW TICKET
    // ==========================================

    const handleViewTicket = (bookingId) => {

        navigate(
            `/ticket/${bookingId}`
        );

    };


    // ==========================================
    // PAYMENT
    // ==========================================

    const handlePayment = (bookingId) => {

        navigate(
            `/payment/${bookingId}`
        );

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
    // FORMAT BOOKING DATE
    // ==========================================

    const formatBookingDate = (date) => {

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


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {

        switch (status) {

            case "CONFIRMED":
                return "my-booking-status confirmed";

            case "CANCELLED":
                return "my-booking-status cancelled";

            case "PENDING":
                return "my-booking-status pending";

            default:
                return "my-booking-status";

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div>

                <Navbar />

                <main className="bookings-page">

                    <div className="loading">

                        Loading your bookings...

                    </div>

                </main>

            </div>

        );

    }


    return (

        <div>

            <Navbar />


            <main className="bookings-page">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <div className="bookings-header">

                    <div>

                        <h1>
                            My Bookings
                        </h1>

                        <p>
                            View and manage all your
                            event bookings.
                        </p>

                    </div>


                    <button
                        className="refresh-bookings-button"
                        onClick={loadBookings}
                    >
                        🔄 Refresh
                    </button>

                </div>


                {/* ================================= */}
                {/* MESSAGES */}
                {/* ================================= */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                {success && (

                    <div className="success-message">

                        {success}

                    </div>

                )}


                {/* ================================= */}
                {/* SUMMARY */}
                {/* ================================= */}

                {bookings.length > 0 && (

                    <div className="bookings-summary">

                        <div className="booking-summary-card">

                            <strong>
                                {bookings.length}
                            </strong>

                            <span>
                                Total Bookings
                            </span>

                        </div>


                        <div className="booking-summary-card">

                            <strong>
                                {
                                    bookings.filter(
                                        (booking) =>
                                            booking.status ===
                                            "CONFIRMED"
                                    ).length
                                }
                            </strong>

                            <span>
                                Confirmed
                            </span>

                        </div>


                        <div className="booking-summary-card">

                            <strong>
                                {
                                    bookings.filter(
                                        (booking) =>
                                            booking.status ===
                                            "PENDING"
                                    ).length
                                }
                            </strong>

                            <span>
                                Pending
                            </span>

                        </div>


                        <div className="booking-summary-card">

                            <strong>
                                {
                                    bookings.filter(
                                        (booking) =>
                                            booking.status ===
                                            "CANCELLED"
                                    ).length
                                }
                            </strong>

                            <span>
                                Cancelled
                            </span>

                        </div>

                    </div>

                )}


                {/* ================================= */}
                {/* EMPTY STATE */}
                {/* ================================= */}

                {bookings.length === 0 ? (

                    <div className="bookings-empty">

                        <div className="empty-booking-icon">
                            🎟️
                        </div>

                        <h2>
                            No Bookings Yet
                        </h2>

                        <p>
                            You haven't booked any
                            events yet.
                        </p>

                        <button
                            className="browse-events-button"
                            onClick={() =>
                                navigate("/events")
                            }
                        >
                            Browse Events
                        </button>

                    </div>

                ) : (

                    /* ================================= */
                    /* BOOKING LIST */
                    /* ================================= */

                    <div className="my-bookings-list">

                        {bookings.map(
                            (booking) => (

                                <article
                                    className="my-booking-card"
                                    key={booking.bookingId}
                                >

                                    {/* CARD HEADER */}

                                    <div className="my-booking-header">

                                        <div>

                                            <span className="booking-label">
                                                Booking Reference
                                            </span>

                                            <h3>
                                                {
                                                    booking.bookingReference
                                                }
                                            </h3>

                                        </div>


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

                                    </div>


                                    {/* EVENT */}

                                    <div className="my-booking-event">

                                        <div className="my-booking-event-icon">
                                            🎬
                                        </div>

                                        <div>

                                            <h2>
                                                {
                                                    booking.eventTitle
                                                }
                                            </h2>

                                            <p>
                                                📍{" "}
                                                {
                                                    booking.venueName
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="my-booking-details">

                                        <div>

                                            <span>
                                                Date
                                            </span>

                                            <strong>
                                                {
                                                    formatDate(
                                                        booking.showDate
                                                    )
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Time
                                            </span>

                                            <strong>
                                                {
                                                    booking.startTime
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Seats
                                            </span>

                                            <div className="my-booking-seats">

                                                {booking.seats?.map(
                                                    (seat) => (

                                                        <span
                                                            key={
                                                                seat
                                                            }
                                                        >
                                                            {
                                                                seat
                                                            }
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>


                                        <div>

                                            <span>
                                                Total Amount
                                            </span>

                                            <strong className="booking-amount">

                                                ₹
                                                {Number(
                                                    booking.totalAmount ||
                                                    0
                                                ).toFixed(2)}

                                            </strong>

                                        </div>

                                    </div>


                                    {/* BOOKING DATE */}

                                    <div className="booking-created-date">

                                        Booked on{" "}

                                        {
                                            formatBookingDate(
                                                booking.bookingDate
                                            )
                                        }

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="my-booking-actions">

                                        {booking.status ===
                                            "CONFIRMED" && (

                                            <button
                                                className="view-ticket-button"
                                                onClick={() =>
                                                    handleViewTicket(
                                                        booking.bookingId
                                                    )
                                                }
                                            >
                                                🎫 View Ticket
                                            </button>

                                        )}


                                        {booking.status ===
                                            "PENDING" && (

                                            <button
                                                className="pay-booking-button"
                                                onClick={() =>
                                                    handlePayment(
                                                        booking.bookingId
                                                    )
                                                }
                                            >
                                                💳 Complete Payment
                                            </button>

                                        )}


                                        {booking.status !==
                                            "CANCELLED" && (

                                            <button
                                                className="cancel-booking-button"
                                                onClick={() =>
                                                    handleCancel(
                                                        booking.bookingId
                                                    )
                                                }
                                                disabled={
                                                    cancellingId ===
                                                    booking.bookingId
                                                }
                                            >

                                                {cancellingId ===
                                                    booking.bookingId
                                                    ? "Cancelling..."
                                                    : "Cancel Booking"}

                                            </button>

                                        )}

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}

            </main>

        </div>

    );

};

export default MyBookings;