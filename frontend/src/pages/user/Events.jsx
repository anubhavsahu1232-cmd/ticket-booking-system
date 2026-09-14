import { useEffect, useState } from "react";
import eventService from "../../services/eventService";
import EventCard from "../../components/EventCard";
import Navbar from "../../components/Navbar";

const Events = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadEvents = async () => {

            try {

                const data =
                    await eventService.getAllEvents();

                setEvents(data);

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Unable to load events"
                );

            } finally {

                setLoading(false);
            }
        };

        loadEvents();

    }, []);

    return (
        <div>

            <Navbar />

            <main className="page-container">

                <div className="page-header">

                    <h1>
                        Available Events
                    </h1>

                    <p>
                        Find your favorite movies and events
                    </p>

                </div>

                {loading && (
                    <div className="loading">
                        Loading events...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    events.length === 0 && (
                        <div className="empty-state">
                            No events available right now.
                        </div>
                    )}

                <div className="events-grid">

                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                        />
                    ))}

                </div>

            </main>

        </div>
    );
};

export default Events;