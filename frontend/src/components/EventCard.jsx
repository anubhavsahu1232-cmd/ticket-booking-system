import { Link } from "react-router-dom";

const EventCard = ({ event }) => {

    return (
        <div className="event-card">

            <div className="event-poster">

                {event.posterUrl ? (
                    <img
                        src={event.posterUrl}
                        alt={event.title}
                    />
                ) : (
                    <div className="poster-placeholder">
                        🎬
                    </div>
                )}

            </div>

            <div className="event-content">

                <span className="event-category">
                    {event.category || "Event"}
                </span>

                <h3>
                    {event.title}
                </h3>

                <p>
                    {event.language || "Language not specified"}
                </p>

                {event.durationMinutes && (
                    <p>
                        ⏱️ {event.durationMinutes} minutes
                    </p>
                )}

                <Link
                    to={`/events/${event.id}`}
                    className="view-event-button"
                >
                    View Details
                </Link>

            </div>

        </div>
    );
};

export default EventCard;