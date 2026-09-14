import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Home = () => {

    return (
        <div>

            <Navbar />

            <section className="hero">

                <div className="hero-content">

                    <span className="hero-badge">
                        🎟️ Easy & Fast Booking
                    </span>

                    <h1>
                        Book Your
                        <br />
                        <span>Favorite Events</span>
                    </h1>

                    <p>
                        Discover movies and events,
                        choose your seats and book
                        your tickets easily.
                    </p>

                    <Link
                        to="/events"
                        className="hero-button"
                    >
                        Explore Events
                    </Link>

                </div>

            </section>

            <section className="features">

                <div className="feature-card">
                    <div>🎬</div>
                    <h3>Wide Selection</h3>
                    <p>
                        Find different movies and events.
                    </p>
                </div>

                <div className="feature-card">
                    <div>💺</div>
                    <h3>Choose Your Seat</h3>
                    <p>
                        Select your preferred seats.
                    </p>
                </div>

                <div className="feature-card">
                    <div>🔐</div>
                    <h3>Secure Booking</h3>
                    <p>
                        Safe and reliable booking system.
                    </p>
                </div>

                <div className="feature-card">
                    <div>🎫</div>
                    <h3>Digital Ticket</h3>
                    <p>
                        Get your ticket with QR code.
                    </p>
                </div>

            </section>

        </div>
    );
};

export default Home;