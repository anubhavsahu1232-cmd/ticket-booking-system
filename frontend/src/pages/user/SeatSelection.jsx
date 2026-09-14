import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import seatService from "../../services/seatService";
import bookingService from "../../services/bookingService";

const SeatSelection = () => {

    const { showId } = useParams();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadSeats = async () => {

            try {

                const data =
                    await seatService.getSeatAvailability(
                        showId
                    );

                setSeats(data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load seats"
                );

            } finally {

                setLoading(false);
            }
        };

        loadSeats();

    }, [showId]);

    const toggleSeat = (seat) => {

        if (seat.status === "BOOKED") {
            return;
        }

        setSelectedSeats((current) => {

            const alreadySelected =
                current.some(
                    (selected) =>
                        selected.seatId === seat.seatId
                );

            if (alreadySelected) {

                return current.filter(
                    (selected) =>
                        selected.seatId !== seat.seatId
                );
            }

            return [...current, seat];
        });
    };

    const isSelected = (seatId) => {

        return selectedSeats.some(
            (seat) => seat.seatId === seatId
        );
    };

    const totalAmount = selectedSeats.reduce(
        (total, seat) =>
            total + Number(seat.price),
        0
    );

    const handleBooking = async () => {

        if (selectedSeats.length === 0) {

            setError(
                "Please select at least one seat"
            );

            return;
        }

        setError("");
        setBookingLoading(true);

        try {

            const seatIds =
                selectedSeats.map(
                    (seat) => seat.seatId
                );

            const booking =
                await bookingService.createBooking(
                    Number(showId),
                    seatIds
                );

            // Go to payment page
            navigate(
                `/payment/${booking.bookingId}`
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to create booking"
            );

        } finally {

            setBookingLoading(false);
        }
    };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="loading">
                    Loading seats...
                </div>
            </>
        );
    }

    return (
        <div>

            <Navbar />

            <main className="page-container">

                <div className="seat-page-header">

                    <div>

                        <Link
                            to="/events"
                            className="back-link"
                        >
                            ← Back to Events
                        </Link>

                        <h1>
                            Select Your Seats
                        </h1>

                        <p>
                            Choose your preferred seats
                        </p>

                    </div>

                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="seat-layout">

                    <div className="seat-section">

                        <div className="screen">
                            SCREEN
                        </div>

                        <div className="seat-legend">

                            <div>
                                <span className="legend-seat available"></span>
                                Available
                            </div>

                            <div>
                                <span className="legend-seat selected"></span>
                                Selected
                            </div>

                            <div>
                                <span className="legend-seat booked"></span>
                                Booked
                            </div>

                        </div>

                        <div className="seat-grid">

                            {seats.map((seat) => (

                                <button
                                    key={seat.seatId}
                                    className={`
                                        seat-button
                                        ${seat.status === "BOOKED"
                                            ? "booked"
                                            : ""}
                                        ${isSelected(seat.seatId)
                                            ? "selected"
                                            : ""}
                                    `}
                                    onClick={() =>
                                        toggleSeat(seat)
                                    }
                                    disabled={
                                        seat.status === "BOOKED"
                                    }
                                    title={`${seat.seatNumber} - ₹${seat.price}`}
                                >
                                    {seat.seatNumber}
                                </button>

                            ))}

                        </div>

                    </div>

                    <aside className="booking-summary">

                        <h2>
                            Booking Summary
                        </h2>

                        <div className="summary-row">

                            <span>
                                Selected Seats
                            </span>

                            <strong>
                                {selectedSeats.length}
                            </strong>

                        </div>

                        <div className="selected-seat-list">

                            {selectedSeats.length === 0 ? (

                                <p>
                                    No seats selected
                                </p>

                            ) : (

                                selectedSeats.map((seat) => (

                                    <div
                                        key={seat.seatId}
                                        className="selected-seat-item"
                                    >

                                        <span>
                                            {seat.seatNumber}
                                        </span>

                                        <span>
                                            ₹{Number(
                                                seat.price
                                            ).toFixed(2)}
                                        </span>

                                    </div>

                                ))

                            )}

                        </div>

                        <div className="summary-total">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{totalAmount.toFixed(2)}
                            </strong>

                        </div>

                        <button
                            className="confirm-booking-button"
                            onClick={handleBooking}
                            disabled={
                                selectedSeats.length === 0 ||
                                bookingLoading
                            }
                        >
                            {bookingLoading
                                ? "Creating Booking..."
                                : "Continue to Payment"}
                        </button>

                    </aside>

                </div>

            </main>

        </div>
    );
};

export default SeatSelection;