import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";

import ticketService from "../../services/ticketService";


const Ticket = () => {

    const { bookingId } = useParams();

    const [ticket, setTicket] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD TICKET
    // ==========================================

    useEffect(() => {

        const loadTicket = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await ticketService
                        .getTicketByBookingId(
                            bookingId
                        );

                setTicket(data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load ticket"
                );

            } finally {

                setLoading(false);

            }

        };

        loadTicket();

    }, [bookingId]);


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
                month: "long",
                year: "numeric",
            }
        );

    };


    // ==========================================
    // PRINT TICKET
    // ==========================================

    const handlePrint = () => {

        window.print();

    };


    // ==========================================
    // DOWNLOAD TICKET
    // ==========================================

    const handleDownload = () => {

        const ticketElement =
            document.getElementById(
                "ticket-print-area"
            );

        if (!ticketElement) {
            return;
        }

        const printWindow =
            window.open(
                "",
                "_blank",
                "width=900,height=800"
            );

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Ticket - ${
                        ticket.ticketNumber
                    }</title>

                    <style>

                        * {
                            box-sizing: border-box;
                        }

                        body {
                            font-family: Arial, sans-serif;
                            background: #f5f5f5;
                            padding: 30px;
                        }

                        .ticket {
                            max-width: 750px;
                            margin: auto;
                            background: white;
                            border-radius: 15px;
                            overflow: hidden;
                            box-shadow:
                                0 5px 20px
                                rgba(0,0,0,0.12);
                        }

                        .ticket-header {
                            padding: 25px;
                            background: #4f46e5;
                            color: white;
                        }

                        .ticket-header h1 {
                            margin: 0;
                        }

                        .ticket-header p {
                            margin-top: 7px;
                        }

                        .ticket-body {
                            padding: 30px;
                        }

                        .ticket-grid {
                            display: grid;
                            grid-template-columns:
                                1fr 1fr;
                            gap: 20px;
                        }

                        .ticket-item span {
                            display: block;
                            color: #777;
                            font-size: 12px;
                            margin-bottom: 5px;
                        }

                        .ticket-item strong {
                            font-size: 16px;
                        }

                        .ticket-seats {
                            display: flex;
                            gap: 8px;
                            flex-wrap: wrap;
                            margin-top: 8px;
                        }

                        .ticket-seat {
                            padding: 7px 10px;
                            background: #eef2ff;
                            border-radius: 6px;
                            font-weight: bold;
                        }

                        .ticket-qr {
                            text-align: center;
                            margin-top: 30px;
                            padding-top: 25px;
                            border-top:
                                1px dashed #ccc;
                        }

                        .ticket-qr img {
                            width: 180px;
                            height: 180px;
                        }

                        .ticket-footer {
                            text-align: center;
                            padding: 18px;
                            background: #f8fafc;
                            color: #666;
                        }

                    </style>
                </head>

                <body>

                    ${ticketElement.innerHTML}

                </body>

            </html>
        `);

        printWindow.document.close();

        printWindow.focus();

        setTimeout(() => {

            printWindow.print();

        }, 500);

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div>

                <Navbar />

                <main className="ticket-page">

                    <div className="loading">

                        Loading ticket...

                    </div>

                </main>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (!ticket) {

        return (

            <div>

                <Navbar />

                <main className="ticket-page">

                    <div className="error-message">

                        {error ||
                            "Ticket not found."}

                    </div>

                    <Link
                        to="/bookings"
                        className="ticket-back-button"
                    >
                        Back to My Bookings
                    </Link>

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


            <main className="ticket-page">

                {/* ================================= */}
                {/* SUCCESS MESSAGE */}
                {/* ================================= */}

                <div className="ticket-success">

                    <div className="ticket-success-icon">
                        ✓
                    </div>

                    <h1>
                        Booking Confirmed!
                    </h1>

                    <p>
                        Your ticket has been
                        successfully generated.
                    </p>

                </div>


                {/* ================================= */}
                {/* TICKET */}
                {/* ================================= */}

                <div
                    id="ticket-print-area"
                    className="ticket-card"
                >

                    {/* HEADER */}

                    <div className="ticket-header">

                        <div>

                            <h2>
                                🎟️ TicketBook
                            </h2>

                            <p>
                                E-Ticket
                            </p>

                        </div>

                        <span className="ticket-confirmed">
                            CONFIRMED
                        </span>

                    </div>


                    {/* BODY */}

                    <div className="ticket-body">

                        {/* EVENT */}

                        <div className="ticket-event">

                            <h1>
                                {
                                    ticket.eventTitle ||
                                    "Event"
                                }
                            </h1>

                            <p>
                                📍{" "}
                                {
                                    ticket.venueName ||
                                    "Venue"
                                }
                            </p>

                        </div>


                        {/* DETAILS */}

                        <div className="ticket-grid">

                            <div className="ticket-item">

                                <span>
                                    Ticket Number
                                </span>

                                <strong>
                                    {
                                        ticket.ticketNumber
                                    }
                                </strong>

                            </div>


                            <div className="ticket-item">

                                <span>
                                    Booking Reference
                                </span>

                                <strong>
                                    {
                                        ticket.bookingReference
                                    }
                                </strong>

                            </div>


                            <div className="ticket-item">

                                <span>
                                    Date
                                </span>

                                <strong>
                                    {
                                        formatDate(
                                            ticket.showDate
                                        )
                                    }
                                </strong>

                            </div>


                            <div className="ticket-item">

                                <span>
                                    Time
                                </span>

                                <strong>
                                    {
                                        ticket.startTime
                                    }
                                </strong>

                            </div>


                            <div className="ticket-item">

                                <span>
                                    Seats
                                </span>

                                <div className="ticket-seats">

                                    {ticket.seats?.map(
                                        (seat) => (

                                            <span
                                                key={seat}
                                                className="ticket-seat"
                                            >
                                                {seat}
                                            </span>

                                        )
                                    )}

                                </div>

                            </div>


                            <div className="ticket-item">

                                <span>
                                    Total Amount
                                </span>

                                <strong className="ticket-price">

                                    ₹
                                    {Number(
                                        ticket.totalAmount ||
                                        0
                                    ).toFixed(2)}

                                </strong>

                            </div>

                        </div>


                        {/* QR CODE */}

                        <div className="ticket-qr-section">

                            <h3>
                                Scan QR Code
                            </h3>

                            {ticket.qrCode ? (

                                <img
                                    src={
                                        `data:image/png;base64,${ticket.qrCode}`
                                    }
                                    alt="Ticket QR Code"
                                    className="ticket-qr-code"
                                />

                            ) : (

                                <p>
                                    QR code unavailable
                                </p>

                            )}

                            <p>
                                Show this QR code at
                                the venue entrance.
                            </p>

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="ticket-footer">

                        <p>
                            Please carry a valid ID
                            proof along with this
                            ticket.
                        </p>

                        <span>
                            Generated on{" "}
                            {formatDate(
                                ticket.generatedAt
                            )}
                        </span>

                    </div>

                </div>


                {/* ================================= */}
                {/* ACTION BUTTONS */}
                {/* ================================= */}

                <div className="ticket-actions">

                    <button
                        className="ticket-print-button"
                        onClick={handlePrint}
                    >
                        🖨️ Print Ticket
                    </button>


                    <button
                        className="ticket-download-button"
                        onClick={handleDownload}
                    >
                        📄 Download Ticket
                    </button>


                    <Link
                        to="/bookings"
                        className="ticket-bookings-button"
                    >
                        My Bookings
                    </Link>


                    <Link
                        to="/events"
                        className="ticket-events-button"
                    >
                        Browse Events
                    </Link>

                </div>

            </main>

        </div>

    );

};

export default Ticket;