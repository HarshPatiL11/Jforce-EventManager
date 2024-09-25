import mongoose from "mongoose";

const EventSchema = mongoose.Schema({
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date, // Change to Date
    required: true,
  },
  eventLocation: {
    type: [String],
    required: true,
  },
  eventDetails: {
    type: String,
    required: true,
  },
  booking: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
});

export default mongoose.model("Event", EventSchema);
