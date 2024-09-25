import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Adminpanel.css";
import AdmNav from "./AdmNav";
import Footer from "./footer";

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAdmin = async () => {
      if (!token) {
        toast.error("Unauthorized access. Please log in.");
        navigate("/login");
        return;
      }
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/user/isadmin",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!data.isAdmin) {
          toast.error("Unauthorized access.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          fetchEvents(); // Fetch events if the user is an admin
        }
      } catch (error) {
        toast.error("Error verifying admin status. Please log in.");
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate, token]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/event/allEvents"
      );
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  
  const handleDel = async (eventId) => {
    try {
      const response = await axios.delete(
        `/api/v1/event/${eventId}/getBooking`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Event Deleted Succesfully")
    } catch (error) {
      console.log("Error in Event Delete funtion");
      
    }
  };

  const viewUsers = async (eventId, eventName) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/event/${eventId}/getBooking`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const bookings = response.data.booking;
      setRegisteredUsers(bookings);
      setSelectedEvent(eventName);
      setShowUsers(true);

      if (bookings.length === 0) {
        toast.warning("No user has booked this event.");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const closeUsersView = () => {
    setShowUsers(false);
    setRegisteredUsers([]);
    setSelectedEvent(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token on logout
    navigate("/login");
  };

  const handleAddEvent = () => {
    navigate("/admin/add-Event");
  };

  return (
    <>
      <AdmNav />
      <div className="admin-panel-container">
        <div className="admin-panel">
          <h2 className="admin-title">Event Management</h2>
          <div className="add-event-btn-div">
            <button className="add-event-btn" onClick={handleAddEvent}>
              Add Event
            </button>
          </div>
          <div className="event-table-container">
            <table className="event-table">
              <thead>
                <tr className="event-table-head">
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="event-table-row">
                    <td>{event.eventName}</td>
                    <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td>{event.eventLocation.join(", ")}</td>
                    <td>
                      <button
                        className="view-users-btn"
                        onClick={() => {
                          if (showUsers && selectedEvent === event.eventName) {
                            closeUsersView(); // Close if the same event is clicked
                          } else {
                            viewUsers(event._id, event.eventName); // View users if different
                          }
                        }}
                      >
                        {showUsers && selectedEvent === event.eventName
                          ? "View Users"
                          : "View Users"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showUsers && selectedEvent && registeredUsers.length > 0 && (
            <div className="registered-users-section">
              <h3>Users Registered for {selectedEvent}:</h3>
              <div className="event-table-container">
                <table className="event-table">
                  <thead>
                    <tr className="registered-users-table-head">
                      <th>User Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map((user) => (
                      <tr key={user._id} className="event-table-row">
                        <td>{user.userName}</td>
                        <td>{user.userEmail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="cls-btn-div">
                <button className="close-users-btn" onClick={closeUsersView}>
                  Close
                </button>
              </div>
            </div>
          )}
          {/* <label className="logout-link">
            <Link onClick={handleLogout}>Logout</Link>
          </label> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminPanel;
