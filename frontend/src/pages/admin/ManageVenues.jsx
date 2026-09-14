import { useEffect, useState } from "react";
import venueService from "../../services/venueService";;

const ManageVenues = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        totalSeats: "",
    });

    const loadVenues = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await venueService.getAllVenues();
            setVenues(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load venues.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVenues();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (
            !formData.name ||
            !formData.address ||
            !formData.city ||
            !formData.totalSeats
        ) {
            setError("Please fill all fields.");
            return;
        }

        try {
            await venueService.createVenue({
                name: formData.name,
                address: formData.address,
                city: formData.city,
                totalSeats: Number(formData.totalSeats),
            });

            setMessage("Venue added successfully.");

            setFormData({
                name: "",
                address: "",
                city: "",
                totalSeats: "",
            });

            loadVenues();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to add venue."
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this venue?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");
            setError("");

            await venueService.deleteVenue(id);

            setMessage("Venue deleted successfully.");

            loadVenues();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete venue. It may be linked with shows or seats."
            );
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <h1>Manage Venues</h1>
                    <p>
                        Add and manage venues for your ticket booking system.
                    </p>
                </div>

                <div className="admin-stat">
                    <span>Total Venues</span>
                    <strong>{venues.length}</strong>
                </div>
            </div>

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="admin-content-grid">

                {/* Add Venue */}
                <div className="admin-card">
                    <h2>Add New Venue</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label>Venue Name</label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter venue name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Address</label>

                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter venue address"
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Enter city"
                            />
                        </div>

                        <div className="form-group">
                            <label>Total Seats</label>

                            <input
                                type="number"
                                name="totalSeats"
                                value={formData.totalSeats}
                                onChange={handleChange}
                                placeholder="Enter total seats"
                                min="1"
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-primary-button"
                        >
                            + Add Venue
                        </button>

                    </form>
                </div>

                {/* Venue List */}
                <div className="admin-card venue-list-card">
                    <div className="admin-card-header">
                        <div>
                            <h2>All Venues</h2>
                            <p>Available venues in the system</p>
                        </div>

                        <button
                            className="admin-secondary-button"
                            onClick={loadVenues}
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="admin-loading">
                            Loading venues...
                        </div>
                    ) : venues.length === 0 ? (
                        <div className="admin-empty">
                            <div className="empty-icon">🏢</div>

                            <h3>No Venues Found</h3>

                            <p>
                                Add your first venue using the form.
                            </p>
                        </div>
                    ) : (
                        <div className="venue-list">

                            {venues.map((venue) => (
                                <div
                                    className="venue-item"
                                    key={venue.id}
                                >
                                    <div className="venue-icon">
                                        🏢
                                    </div>

                                    <div className="venue-info">
                                        <h3>{venue.name}</h3>

                                        <p>
                                            📍 {venue.address}
                                        </p>

                                        <p>
                                            🌆 {venue.city}
                                        </p>

                                        <span className="seat-badge">
                                            💺 {venue.totalSeats} Seats
                                        </span>
                                    </div>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(venue.id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ManageVenues;