import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddEvent.css";
import AdmNav from "./AdmNav";
import Footer from "./footer";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventLocation: "",
    eventDetails: "",
  });

  const [errors, setErrors] = useState({
    eventNameError: "",
    eventDateError: "",
    eventLocationError: "",
    eventDetailsError: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    switch (name) {
      case "eventName":
        if (value.trim() === "") {
          setErrors((prev) => ({
            ...prev,
            eventNameError: "Event Name is required",
          }));
        } else {
          setErrors((prev) => ({ ...prev, eventNameError: "" }));
        }
        break;
      case "eventDate":
        const selectedDate = new Date(value);
        const currentDate = new Date();
        if (!value || selectedDate <= currentDate) {
          setErrors((prev) => ({
            ...prev,
            eventDateError: "Please select a valid future date",
          }));
        } else {
          setErrors((prev) => ({ ...prev, eventDateError: "" }));
        }
        break;
      case "eventLocation":
        if (value.trim() === "") {
          setErrors((prev) => ({
            ...prev,
            eventLocationError: "Event Location is required",
          }));
        } else {
          setErrors((prev) => ({ ...prev, eventLocationError: "" }));
        }
        break;
      case "eventDetails":
        if (value.length > 250) {
          setErrors((prev) => ({
            ...prev,
            eventDetailsError: "Event Details must be less than 250 characters",
          }));
        } else {
          setErrors((prev) => ({ ...prev, eventDetailsError: "" }));
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized access. Please log in.");
        navigate("/login");
        return;
      }
    };

    checkAdmin();
  }, [navigate]);

  const validateForm = () => {
    const { eventName, eventDate, eventLocation, eventDetails } = formData;
    let isValid = true;

    if (!eventName) {
      setErrors((prev) => ({
        ...prev,
        eventNameError: "Event Name is required",
      }));
      isValid = false;
    }

    const selectedDate = new Date(eventDate);
    const currentDate = new Date();
    if (!eventDate || selectedDate <= currentDate) {
      setErrors((prev) => ({
        ...prev,
        eventDateError: "Please select a valid future date",
      }));
      isValid = false;
    }

    if (!eventLocation) {
      setErrors((prev) => ({
        ...prev,
        eventLocationError: "Event Location is required",
      }));
      isValid = false;
    }
if(!eventDetails){
   setErrors((prev) => ({
     ...prev,
     eventDetailsError: "Event details is required",
   }));
   isValid = false;
}
    if (eventDetails.length > 250) {
      setErrors((prev) => ({
        ...prev,
        eventDetailsError: "Event Details must be less than 250 characters",
      }));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/event/AddEvent",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast.success("Event added successfully");
        setFormData({
          eventName: "",
          eventDate: "",
          eventLocation: "",
          eventDetails: "",
        });
        navigate("/admin/manage-events");
      } else {
        toast.error(response.data.message || "Failed to add event");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Error occurred while adding the event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdmNav />
      <div className="event-form-container">
        <div className="event-form">
          <h2>Create New Event</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Event Name"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
            />
            {errors.eventNameError && (
              <p className="error-message">{errors.eventNameError}</p>
            )}

            <input
              type="date"
              placeholder="Event Date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
            />
            {errors.eventDateError && (
              <p className="error-message">{errors.eventDateError}</p>
            )}

            <input
              type="text"
              placeholder="Event Location"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleChange}
            />
            {errors.eventLocationError && (
              <p className="error-message">{errors.eventLocationError}</p>
            )}

            <textarea
              placeholder="Event Details"
              name="eventDetails"
              value={formData.eventDetails}
              onChange={handleChange}
            ></textarea>
            {errors.eventDetailsError && (
              <p className="error-message">{errors.eventDetailsError}</p>
            )}

            <button className="event-form-btn" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Event"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddEvent;
