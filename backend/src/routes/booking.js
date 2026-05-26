const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking");

// Create booking
router.post("/bookings", bookingController.create_newBooking);

// Get all bookings
router.get("/bookings", bookingController.get_allBookings);

// Get today's bookings
router.get("/bookings/today", bookingController.get_todayBookings);

// Update booking status
router.patch("/bookings/:id/status", bookingController.update_bookingStatus);

module.exports = router;
