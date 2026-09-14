import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import eventService from "../../services/eventService";
import showService from "../../services/showService";

const EventDetails = () => {

    const { id } = useParams();

    const [event, setEvent] = useState(null);
    const [shows, setShows] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadData = async () => {

            try {

                const eventData =
                    await eventService.getEventById(id);

                const showData =
                    await showService.getShowsByEvent(id);

                setEvent(eventData);
                setShows(showData);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load event details"
                );

            } finally {

                setLoading(false);
            }
        };

        loadData();

    }, [id]);

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="loading">
                    Loading event...
                </div>
            </>
        );
    }

    if (error) {

        return (
            <>
                <Navbar />

                <div className="page-container">

                    <div className="error-message">
                        {error}
                    </div>

                </div>
            </>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <div>

            <Navbar />

            <main className="page-container">

                <div className="event-details">

                    <div className="event-details-poster">

                        {event.posterUrl ? (
                            <img
                                src={event.posterUrl}
                                alt={event.title}
                            />
                        ) : (
                            <div className="poster-placeholder large">
                                🎬
                            </div>
                        )}

                    </div>

                    <div className="event-details-info">

                        <span className="event-category">
                            {event.category}
                        </span>

                        <h1>
                            {event.title}
                        </h1>

                        <p className="description">
                            {event.description ||
                                "No description available."}
                        </p>

                        <div className="event-meta">

                            <span>
                                🌐 {event.language}
                            </span>

                            <span>
                                ⏱️ {event.durationMinutes} minutes
                            </span>

                        </div>

                    </div>

                </div>

                <section className="shows-section">

                    <h2>
                        Available Shows
                    </h2>

                    {shows.length === 0 ? (

                        <div className="empty-state">
                            No shows available for this event.
                        </div>

                    ) : (

                        <div className="shows-grid">

                            {shows.map((show) => (

                                <div
                                    className="show-card"
                                    key={show.id}
                                >

                                    <div>
                                        <strong>
                                            📅 {show.showDate}
                                        </strong>

                                        <p>
                                            🕐 {show.startTime}
                                            {" - "}
                                            {show.endTime}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/shows/${show.id}/seats`}
                                        className="select-show-button"
                                    >
                                        Select Seats
                                    </Link>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default EventDetails;