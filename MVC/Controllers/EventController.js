import mongoose from "mongoose";
import EventModel from "../Models/EventModel.js";
import UserModel from "../Models/UserModel.js";

export const addEvent = async (req, res) => {
  try {
    const { eventName, eventDate, eventLocation, eventDetails } = req.body;

    if (!eventName || !eventDate || !eventLocation || !eventDetails) {
      return res.status(400).send({
        success: false,
        message: "Enter all fields",
      });
    }

    // Ensure eventDate is a valid date
    const parsedEventDate = new Date(eventDate);
    if (isNaN(parsedEventDate.getTime())) {
      return res.status(400).send({
        success: false,
        message: "Invalid date format",
      });
    }

    const newEvent = await EventModel.create({
      eventName,
      eventDate: parsedEventDate,
      eventLocation,
      eventDetails,
    });

    return res.status(201).send({
      success: true,
      message: "Event added successfully",
      newEvent,
    });
  } catch (error) {
    console.error("Error in addEvent API:", error);
    return res.status(500).send({
      success: false,
      message: "Error in add event API",
    });
  }
};

export const getEventAll = async (req, res) => {
  try {
    const events = await EventModel.find({});
    if (!events) {
      return res.status(404).send({
        success: false,
        message: "No Events",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Events Found",
      events,
    });
  } catch (error) {
    error;
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "ERROR IN GET ALL EVENT API",
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const eventID = req.params._id;
    console.log(eventID);

    if (!eventID || eventID === null) {
      return res.status(404).send({
        success: false,
        message: "No Event Id",
      });
    }
    const event = await EventModel.findById(eventID);
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "No Events",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Events Found",
      event,
    });
  } catch (error) {
    error;
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "ERROR IN GET ALL EVENT API",
    });
  }
};

export const addBooking = async (req, res) => {
  try {
    const userId = req.userId;
    const eventId = req.params._id;

    if (!eventId) {
      return res.status(400).send({
        success: false,
        message: "No event ID provided",
      });
    }

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "No user ID provided",
      });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }
    if (event.booking.includes(userId)) {
      return res.status(400).send({
        success: false,
        message: "User has already booked this event",
      });
    }
    event.booking.push(userId);
    await event.save();

    return res.status(200).send({
      success: true,
      message: "Event booked successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in booking API",
    });
  }
};

export const CheckEventBookedByID = async (req, res) => {
  try {
    const eventId = req.params._id;
    const userId = req.userId;

    // Debugging: Log request parameters
    console.log("Received Event ID:", eventId);
    console.log("Received User ID:", userId);

    // Validate the presence of userId
    if (!userId) {
      console.log("No user ID provided");
      return res.status(400).send({
        success: false,
        message: "No user ID provided",
      });
    }

    // Validate the presence of eventId
    if (!eventId) {
      console.log("No event ID provided");
      return res.status(400).send({
        success: false,
        message: "No event ID provided",
      });
    }

    // Find the event by ID and check if it exists
    const event = await EventModel.findById(eventId);

    // Debugging: Log the event if found or not
    if (!event) {
      console.log(`Event with ID ${eventId} not found`);
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    } else {
      console.log(`Event found: ${event}`);
    }

    // Check if the user has already booked the event
    const isBooked = event.booking.includes(userId);

    // Debugging: Log booking status
    console.log(
      `Booking status for user ${userId} on event ${eventId}: ${isBooked}`
    );

    if (isBooked) {
      return res.status(200).send({
        success: true,
        message: "Event booked by user",
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "Event not booked by user",
      });
    }
  } catch (error) {
    console.error("Error in get booking API", error);
    return res.status(500).send({
      success: false,
      message: "Error in get booking API",
      error: error.message, // Return the error message for debugging
    });
  }
};

export const getBookingForID = async (req, res) => {
  try {
    const eventId = req.params._id;

    if (!eventId) {
      return res.status(400).send({
        success: false,
        message: "No event ID provided",
      });
    }

    // Populate booking with the User model
    const event = await EventModel.findById(eventId).populate(
      "booking",
      "userName userEmail"
    ); // Adjust fields if necessary
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Booking details fetched successfully",
      booking: event.booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in get booking API",
    });
  }
};

export const EventDeleteByID = async (req, res) => {
  try {
    const eventId = req.params._id;

    if (!eventId) {
      return res.status(400).send({
        success: false,
        message: "No event ID provided",
      });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).send({
        success: false,
        message: "Event not found",
      });
    }

    await event.deleteOne();

    return res.status(200).send({
      success: true,
      message: "Event Deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in delete event API",
    });
  }
};
