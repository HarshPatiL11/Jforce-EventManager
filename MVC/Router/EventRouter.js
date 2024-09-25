import express from 'express';
import { addBooking, addEvent, CheckEventBookedByID, EventDeleteByID, getBookingForID, getEventAll, getEventById } from '../Controllers/EventController.js';
import { adminMiddleware, authMiddle } from '../Middleware/AuthMiddleware.js';

const EventRouter = express.Router();

EventRouter.post('/AddEvent',authMiddle,adminMiddleware, addEvent);//working
EventRouter.get('/allEvents',getEventAll)//working
EventRouter.get("/:_id", getEventById);//working
EventRouter.put("/:_id/book", authMiddle, addBooking);//working
EventRouter.get("/:_id/checkBooking", authMiddle, CheckEventBookedByID);//working
EventRouter.get("/:_id/getBooking", authMiddle, adminMiddleware, getBookingForID);

EventRouter.delete(
  "/:_id/delete",
  authMiddle,
  adminMiddleware,
  EventDeleteByID
);
export default EventRouter;