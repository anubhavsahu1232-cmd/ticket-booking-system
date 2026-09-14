import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";

import bookingService from "../../services/bookingService";
import paymentService from "../../services/paymentService";


const Payment = () => {

    const { bookingId } = useParams();

    const navigate = useNavigate();


    // ==========================================
    // STATE
    // ==========================================

    const [booking, setBooking] =
        useState(null);

    const [paymentMethod, setPaymentMethod] =
        useState("UPI");

    const [loading, setLoading] =
        useState(true);

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [timeLeft, setTimeLeft] =
        useState(600);


    // ==========================================
    // LOAD BOOKING
    // ==========================================

    useEffect(() => {

        const loadBooking = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await bookingService.getBookingById(
                        bookingId
                    );

                setBooking(data);

                // ----------------------------------
                // Calculate remaining time
                // ----------------------------------

                if (data.bookingDate) {

                    const bookingTime =
                        new Date(
                            data.bookingDate
                        ).getTime();

                    const expiryTime =
                        bookingTime +
                        (10 * 60 * 1000);

                    const remaining =
                        Math.max(
                            0,
                            Math.floor(
                                (expiryTime -
                                    Date.now()) / 1000
                            )
                        );

                    setTimeLeft(remaining);

                }

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load booking"
                );

            } finally {

                setLoading(false);

            }

        };


        loadBooking();

    }, [bookingId]);


    // ==========================================
    // PAYMENT TIMER
    // ==========================================

    useEffect(() => {

        if (timeLeft <= 0) {
            return;
        }

        const timer =
            setInterval(() => {

                setTimeLeft(
                    (previousTime) =>
                        Math.max(
                            0,
                            previousTime - 1
                        )
                );

            }, 1000);


        return () => {
            clearInterval(timer);
        };

    }, [timeLeft]);


    // ==========================================
    // FORMAT TIME
    // ==========================================

    const formatTime = (seconds) => {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;

    };


    // ==========================================
    // MAKE PAYMENT
    // ==========================================

    const handlePayment = async () => {

        if (!booking) {
            return;
        }

        if (timeLeft <= 0) {

            setError(
                "Payment time has expired. Please create a new booking."
            );

            return;
        }


        if (booking.status !== "PENDING") {

            setError(
                `This booking is ${booking.status.toLowerCase()}.`
            );

            return;
        }


        try {

            setProcessing(true);
            setError("");

            await paymentService.makePayment(
                Number(bookingId),
                paymentMethod
            );


            // ----------------------------------
            // Payment successful
            // ----------------------------------

            navigate(
                `/ticket/${bookingId}`
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Payment failed. Please try again."
            );

        } finally {

            setProcessing(false);

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div>

                <Navbar />

                <main className="payment-container">

                    <div className="loading">

                        Loading booking details...

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // ERROR / NO BOOKING
    // ==========================================

    if (!booking) {

        return (

            <div>

                <Navbar />

                <main className="payment-container">

                    <div className="error-message">

                        {error ||
                            "Booking not found."}

                    </div>

                    <button
                        className="admin-primary-button"
                        onClick={() =>
                            navigate("/events")
                        }
                    >
                        Back to Events
                    </button>

                </main>

            </div>

        );

    }


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div>

            <Navbar />


            <main className="payment-container">

                <div className="payment-page-header">

                    <h1>
                        Complete Payment
                    </h1>

                    <p>
                        Secure your booking before
                        the payment timer expires.
                    </p>

                </div>


                {/* ================================= */}
                {/* TIMER */}
                {/* ================================= */}

                <div
                    className={
                        timeLeft <= 60
                            ? "payment-timer danger"
                            : "payment-timer"
                    }
                >

                    <span>
                        ⏱️ Payment expires in
                    </span>

                    <strong>
                        {formatTime(timeLeft)}
                    </strong>

                </div>


                {timeLeft <= 0 && (

                    <div className="error-message">

                        Payment time has expired.
                        Please go back and select
                        seats again.

                    </div>

                )}


                {/* ================================= */}
                {/* ERROR */}
                {/* ================================= */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                <div className="payment-layout">

                    {/* ================================= */}
                    {/* BOOKING SUMMARY */}
                    {/* ================================= */}

                    <section className="payment-card">

                        <h2>
                            Booking Summary
                        </h2>


                        <div className="payment-detail">

                            <span>
                                Booking Reference
                            </span>

                            <strong>
                                {
                                    booking.bookingReference
                                }
                            </strong>

                        </div>


                        <div className="payment-detail">

                            <span>
                                Event
                            </span>

                            <strong>
                                {
                                    booking.eventTitle
                                }
                            </strong>

                        </div>


                        <div className="payment-detail">

                            <span>
                                Venue
                            </span>

                            <strong>
                                {
                                    booking.venueName
                                }
                            </strong>

                        </div>


                        <div className="payment-detail">

                            <span>
                                Date
                            </span>

                            <strong>
                                {
                                    booking.showDate
                                }
                            </strong>

                        </div>


                        <div className="payment-detail">

                            <span>
                                Time
                            </span>

                            <strong>
                                {
                                    booking.startTime
                                }
                            </strong>

                        </div>


                        {/* SEATS */}

                        <div className="payment-detail">

                            <span>
                                Selected Seats
                            </span>

                            <div className="payment-seats">

                                {booking.seats?.map(
                                    (seat) => (

                                        <span
                                            key={seat}
                                        >
                                            {seat}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>


                        <div className="payment-total">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹
                                {Number(
                                    booking.totalAmount ||
                                    0
                                ).toFixed(2)}
                            </strong>

                        </div>

                    </section>


                    {/* ================================= */}
                    {/* PAYMENT METHOD */}
                    {/* ================================= */}

                    <section className="payment-card">

                        <h2>
                            Payment Method
                        </h2>


                        {/* UPI */}

                        <label className="payment-option">

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="UPI"
                                checked={
                                    paymentMethod ===
                                    "UPI"
                                }
                                onChange={(event) =>
                                    setPaymentMethod(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    processing ||
                                    timeLeft <= 0
                                }
                            />

                            <div>

                                <strong>
                                    📱 UPI
                                </strong>

                                <span>
                                    Pay using UPI
                                </span>

                            </div>

                        </label>


                        {/* CARD */}

                        <label className="payment-option">

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="CARD"
                                checked={
                                    paymentMethod ===
                                    "CARD"
                                }
                                onChange={(event) =>
                                    setPaymentMethod(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    processing ||
                                    timeLeft <= 0
                                }
                            />

                            <div>

                                <strong>
                                    💳 Card
                                </strong>

                                <span>
                                    Credit / Debit Card
                                </span>

                            </div>

                        </label>


                        {/* NET BANKING */}

                        <label className="payment-option">

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="NET_BANKING"
                                checked={
                                    paymentMethod ===
                                    "NET_BANKING"
                                }
                                onChange={(event) =>
                                    setPaymentMethod(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    processing ||
                                    timeLeft <= 0
                                }
                            />

                            <div>

                                <strong>
                                    🏦 Net Banking
                                </strong>

                                <span>
                                    Pay using your bank
                                </span>

                            </div>

                        </label>


                        {/* CASH */}

                        <label className="payment-option">

                            <input
                                type="radio"
                                name="paymentMethod"
                                value="CASH"
                                checked={
                                    paymentMethod ===
                                    "CASH"
                                }
                                onChange={(event) =>
                                    setPaymentMethod(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    processing ||
                                    timeLeft <= 0
                                }
                            />

                            <div>

                                <strong>
                                    💵 Cash
                                </strong>

                                <span>
                                    Cash payment
                                </span>

                            </div>

                        </label>


                        {/* PAY BUTTON */}

                        <button
                            className="pay-button"
                            onClick={
                                handlePayment
                            }
                            disabled={
                                processing ||
                                timeLeft <= 0
                            }
                        >

                            {processing
                                ? "Processing Payment..."
                                : `Pay ₹${Number(
                                    booking.totalAmount ||
                                    0
                                ).toFixed(2)}`}

                        </button>


                        <p className="payment-note">

                            🔒 This is a simulated
                            payment system for the
                            project.

                        </p>

                    </section>

                </div>

            </main>

        </div>

    );

};

export default Payment;