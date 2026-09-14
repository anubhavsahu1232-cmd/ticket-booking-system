import { useEffect, useState } from "react";

import showService from "../../services/showService";
import eventService from "../../services/eventService";
import venueService from "../../services/venueService";
import Navbar from "../../components/Navbar";

const ManageShows = () => {

    const [shows, setShows] = useState([]);
    const [events, setEvents] = useState([]);
    const [venues, setVenues] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [editingShowId, setEditingShowId] = useState(null);

    const [form, setForm] = useState({
        eventId: "",
        venueId: "",
        showDate: "",
        startTime: "",
        endTime: "",
    });


    // ================= LOAD DATA =================

    const loadShows = async () => {

        try {

            const data =
                await showService.getAllShows();

            setShows(data);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load shows."
            );
        }
    };


    const loadEvents = async () => {

        try {

            const data =
                await eventService.getAllEvents();

            setEvents(data);

        } catch (err) {

            console.error(err);

            setError(
                "Failed to load events."
            );
        }
    };


    const loadVenues = async () => {

        try {

            const data =
                await venueService.getAllVenues();

            setVenues(data);

        } catch (err) {

            console.error(err);

            setError(
                "Failed to load venues."
            );
        }
    };


    const loadAllData = async () => {

        setLoading(true);
        setError("");

        try {

            await Promise.all([
                loadShows(),
                loadEvents(),
                loadVenues(),
            ]);

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadAllData();

    }, []);


    // ================= FORM =================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };


    // ================= CREATE / UPDATE =================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (
            !form.eventId ||
            !form.venueId ||
            !form.showDate ||
            !form.startTime ||
            !form.endTime
        ) {

            setError(
                "Please fill all fields."
            );

            return;
        }


        if (form.startTime >= form.endTime) {

            setError(
                "End time must be after start time."
            );

            return;
        }


        const showData = {

            eventId: Number(form.eventId),

            venueId: Number(form.venueId),

            showDate: form.showDate,

            startTime: form.startTime,

            endTime: form.endTime,
        };


        try {

            setSaving(true);

            if (editingShowId) {

                await showService.updateShow(
                    editingShowId,
                    showData
                );

                setMessage(
                    "Show updated successfully."
                );

            } else {

                await showService.createShow(
                    showData
                );

                setMessage(
                    "Show created successfully."
                );
            }


            resetForm();

            await loadShows();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to save show."
            );

        } finally {

            setSaving(false);
        }
    };


    // ================= EDIT =================

    const handleEdit = (show) => {

        setMessage("");
        setError("");

        setEditingShowId(show.id);

        setForm({

            eventId:
                show.eventId ||
                show.event?.id ||
                "",

            venueId:
                show.venueId ||
                show.venue?.id ||
                "",

            showDate:
                show.showDate || "",

            startTime:
                show.startTime
                    ? String(show.startTime).substring(0, 5)
                    : "",

            endTime:
                show.endTime
                    ? String(show.endTime).substring(0, 5)
                    : "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    // ================= DELETE =================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this show?"
            );

        if (!confirmed) {
            return;
        }


        try {

            setMessage("");
            setError("");

            await showService.deleteShow(id);

            setMessage(
                "Show deleted successfully."
            );

            await loadShows();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to delete show."
            );
        }
    };


    // ================= RESET =================

    const resetForm = () => {

        setForm({

            eventId: "",
            venueId: "",
            showDate: "",
            startTime: "",
            endTime: "",
        });

        setEditingShowId(null);
    };


    const handleCancelEdit = () => {

        resetForm();

        setMessage("");
        setError("");
    };


    // ================= HELPERS =================

    const getEventName = (show) => {

        if (show.event?.title) {
            return show.event.title;
        }

        const event =
            events.find(
                (item) =>
                    item.id ===
                    (show.eventId ||
                        show.event?.id)
            );

        return event?.title ||
            "Unknown Event";
    };


    const getVenueName = (show) => {

        if (show.venue?.name) {
            return show.venue.name;
        }

        const venue =
            venues.find(
                (item) =>
                    item.id ===
                    (show.venueId ||
                        show.venue?.id)
            );

        return venue?.name ||
            "Unknown Venue";
    };


    return (
        <div>

            <Navbar />

            <main className="admin-page">

                {/* ================= HEADER ================= */}

                <div className="admin-header">

                    <div>

                        <h1>
                            Manage Shows
                        </h1>

                        <p>
                            Create and manage event shows and schedules.
                        </p>

                    </div>

                    <div className="admin-stat">

                        <span>
                            Total Shows
                        </span>

                        <strong>
                            {shows.length}
                        </strong>

                    </div>

                </div>


                {/* ================= MESSAGES ================= */}

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


                {/* ================= FORM ================= */}

                <section className="admin-card">

                    <div className="admin-card-header">

                        <div>

                            <h2>
                                {editingShowId
                                    ? "Update Show"
                                    : "Create New Show"}
                            </h2>

                            <p>
                                Schedule an event at a venue.
                            </p>

                        </div>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                    >

                        {/* EVENT */}

                        <div className="form-group">

                            <label>
                                Event *
                            </label>

                            <select
                                name="eventId"
                                value={form.eventId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Event
                                </option>

                                {events.map(
                                    (event) => (

                                        <option
                                            key={event.id}
                                            value={event.id}
                                        >
                                            {event.title}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* VENUE */}

                        <div className="form-group">

                            <label>
                                Venue *
                            </label>

                            <select
                                name="venueId"
                                value={form.venueId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Venue
                                </option>

                                {venues.map(
                                    (venue) => (

                                        <option
                                            key={venue.id}
                                            value={venue.id}
                                        >

                                            {venue.name}
                                            {" - "}
                                            {venue.city}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* DATE */}

                        <div className="form-group">

                            <label>
                                Show Date *
                            </label>

                            <input
                                type="date"
                                name="showDate"
                                value={form.showDate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* TIME */}

                        <div className="admin-form-grid">

                            <div className="form-group">

                                <label>
                                    Start Time *
                                </label>

                                <input
                                    type="time"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    End Time *
                                </label>

                                <input
                                    type="time"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div className="admin-form-actions">

                            <button
                                type="submit"
                                className="admin-primary-button"
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : editingShowId
                                        ? "Update Show"
                                        : "Create Show"}

                            </button>


                            {editingShowId && (

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


                {/* ================= SHOW LIST ================= */}

                <section className="admin-card">

                    <div className="admin-card-header">

                        <div>

                            <h2>
                                All Shows
                            </h2>

                            <p>
                                {shows.length} shows scheduled
                            </p>

                        </div>

                        <button
                            className="admin-secondary-button"
                            onClick={loadAllData}
                        >
                            Refresh
                        </button>

                    </div>


                    {loading ? (

                        <div className="admin-loading">
                            Loading shows...
                        </div>

                    ) : shows.length === 0 ? (

                        <div className="admin-empty">

                            <div className="empty-icon">
                                🎬
                            </div>

                            <h3>
                                No Shows Found
                            </h3>

                            <p>
                                Create your first show using the form.
                            </p>

                        </div>

                    ) : (

                        <div className="show-admin-grid">

                            {shows.map(
                                (show) => (

                                    <div
                                        className="show-admin-card"
                                        key={show.id}
                                    >

                                        <div className="show-admin-icon">
                                            🎬
                                        </div>


                                        <div className="show-admin-info">

                                            <h3>
                                                {getEventName(show)}
                                            </h3>

                                            <p>
                                                🏢{" "}
                                                {getVenueName(show)}
                                            </p>

                                            <p>
                                                📅{" "}
                                                {show.showDate}
                                            </p>

                                            <p>
                                                🕐{" "}
                                                {show.startTime}
                                                {" - "}
                                                {show.endTime}
                                            </p>

                                        </div>


                                        <div className="show-admin-actions">

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    handleEdit(show)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(show.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default ManageShows;