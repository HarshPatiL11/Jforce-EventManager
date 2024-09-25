import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Make sure you are using this import correctly
import "./Home.css";
import Navbar from "./Navbar";
import Footer from "./footer";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/event/allEvents"
        );
        setEvents(response.data.events);

        if (token) {
          const bookingStatuses = {};
          for (let event of response.data.events) {
            const bookingResponse = await axios.get(
              `http://localhost:8000/api/v1/event/${event._id}/checkBooking`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (bookingResponse.data.success) {
              bookingStatuses[event._id] = true;
            }
          }
          setBookedEvents(bookingStatuses);
        }
      } catch (error) {
        console.error("Error fetching events or booking status", error);
      }
    };

    fetchEvents();
  }, [token]);

  const handleBookClick = async (event) => {
    if (!token) {
      toast.info("Please login to book this event.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/event/${event._id}/book`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setBookedEvents((prevBookedEvents) => ({
          ...prevBookedEvents,
          [event._id]: true,
        }));
        toast.success("Booking confirmed");
      } else {
        toast.error(`Failed to book: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error booking event", error);
      toast.error("Error occurred while booking.");
      localStorage.removeItem("token")
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-content">
          <h2 className="home-title">Available Events</h2>
          <div className="event-table-container">
            <table className="event-table">
              <thead>
                <tr className="event-table-head">
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="event-table-row">
                    <td>{event.eventName}</td>
                    <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td>
                      {event.eventLocation?.join(", ") ||
                        "Location not available"}
                    </td>
                    <td>{event.eventDetails}</td>
                    <td>
                      <button
                        className="event-book-btn"
                        onClick={() => handleBookClick(event)}
                        disabled={token && bookedEvents[event._id]}
                      >
                        {token && bookedEvents[event._id]
                          ? "Booked"
                          : "Book Now"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* {isLoggedIn ? (
            <label className="logout-link">
              <Link onClick={handleLogout}>Logout</Link>
            </label>
          ) : (
            <label className="logout-link">
              <Link to="/login">Login</Link>
            </label>
          )} */}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
