import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import eventService from "../../services/eventService";

const emptyForm = {
    title: "",
    description: "",
    category: "",
    language: "",
    durationMinutes: "",
    posterUrl: "",
};

const ManageEvents = () => {

    const [events, setEvents] = useState([]);

    const [formData, setFormData] =
        useState(emptyForm);

    const [editingId, setEditingId] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ================================
    // LOAD EVENTS
    // ================================

    const loadEvents = async () => {

        try {

            setLoading(true);

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

    useEffect(() => {

        loadEvents();

    }, []);

    // ================================
    // HANDLE INPUT
    // ================================

    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value,
        });
    };

    // ================================
    // SUBMIT
    // ================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        const data = {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            language: formData.language,
            durationMinutes:
                formData.durationMinutes
                    ? Number(formData.durationMinutes)
                    : null,
            posterUrl: formData.posterUrl,
        };

        try {

            if (editingId) {

                await eventService.updateEvent(
                    editingId,
                    data
                );

                setSuccess(
                    "Event updated successfully"
                );

            } else {

                await eventService.createEvent(
                    data
                );

                setSuccess(
                    "Event created successfully"
                );
            }

            setFormData(emptyForm);
            setEditingId(null);

            await loadEvents();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to save event"
            );

        } finally {

            setSaving(false);
        }
    };

    // ================================
    // EDIT
    // ================================

    const handleEdit = (event) => {

        setEditingId(event.id);

        setFormData({
            title: event.title || "",
            description:
                event.description || "",
            category:
                event.category || "",
            language:
                event.language || "",
            durationMinutes:
                event.durationMinutes || "",
            posterUrl:
                event.posterUrl || "",
        });

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ================================
    // CANCEL EDIT
    // ================================

    const handleCancelEdit = () => {

        setEditingId(null);
        setFormData(emptyForm);
        setError("");
        setSuccess("");
    };

    // ================================
    // DELETE
    // ================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this event?"
            );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");

        try {

            await eventService.deleteEvent(id);

            setSuccess(
                "Event deleted successfully"
            );

            await loadEvents();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Unable to delete event"
            );
        }
    };

    return (
        <div>

            <Navbar />

            <main className="admin-container">

                <div className="admin-page-header">

                    <div>

                        <h1>
                            Manage Events
                        </h1>

                        <p>
                            Create and manage movies and
                            other events.
                        </p>

                    </div>

                </div>

                {/* Messages */}

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

                {/* Event Form */}

                <section className="admin-form-card">

                    <h2>
                        {editingId
                            ? "Edit Event"
                            : "Add New Event"}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="admin-form"
                    >

                        <div className="admin-form-grid">

                            <div className="form-group">

                                <label>
                                    Event Title *
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter event title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Category *
                                </label>

                                <input
                                    type="text"
                                    name="category"
                                    placeholder="Movie, Concert, Sports..."
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Language
                                </label>

                                <input
                                    type="text"
                                    name="language"
                                    placeholder="Hindi, English..."
                                    value={formData.language}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Duration (minutes)
                                </label>

                                <input
                                    type="number"
                                    name="durationMinutes"
                                    placeholder="150"
                                    min="1"
                                    value={
                                        formData.durationMinutes
                                    }
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                Poster URL
                            </label>

                            <input
                                type="url"
                                name="posterUrl"
                                placeholder="https://example.com/poster.jpg"
                                value={formData.posterUrl}
                                onChange={handleChange}
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                placeholder="Enter event description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                            />

                        </div>

                        <div className="admin-form-actions">

                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Update Event"
                                        : "Add Event"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="admin-secondary-button"
                                    onClick={
                                        handleCancelEdit
                                    }
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </section>

                {/* Events List */}

                <section className="admin-list-section">

                    <div className="admin-list-header">

                        <h2>
                            All Events
                        </h2>

                        <span>
                            {events.length} Events
                        </span>

                    </div>

                    {loading ? (

                        <div className="loading">
                            Loading events...
                        </div>

                    ) : events.length === 0 ? (

                        <div className="empty-state">
                            No events available.
                        </div>

                    ) : (

                        <div className="admin-events-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Event
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Language
                                        </th>

                                        <th>
                                            Duration
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {events.map((event) => (

                                        <tr key={event.id}>

                                            <td>

                                                <div className="admin-event-cell">

                                                    {event.posterUrl ? (

                                                        <img
                                                            src={
                                                                event.posterUrl
                                                            }
                                                            alt={
                                                                event.title
                                                            }
                                                            className="admin-event-image"
                                                        />

                                                    ) : (

                                                        <div className="admin-event-placeholder">
                                                            🎬
                                                        </div>

                                                    )}

                                                    <div>

                                                        <strong>
                                                            {event.title}
                                                        </strong>

                                                        <small>
                                                            ID: {event.id}
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>
                                                {event.category ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {event.language ||
                                                    "-"}
                                            </td>

                                            <td>
                                                {event.durationMinutes
                                                    ? `${event.durationMinutes} min`
                                                    : "-"}
                                            </td>

                                            <td>

                                                <div className="table-actions">

                                                    <button
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                event
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                event.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default ManageEvents;