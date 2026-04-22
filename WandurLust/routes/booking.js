const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// All booking routes require authentication
router.use(isLoggedIn);

// Show all user bookings
router.get("/", wrapAsync(bookingController.showUserBookings));

// Show host's bookings (bookings for their listings)
router.get("/host", wrapAsync(bookingController.showHostBookings));

// Show single booking
router.get("/:id", wrapAsync(bookingController.showBooking));

// Cancel booking
router.delete("/:id", wrapAsync(bookingController.cancelBooking));

module.exports = router;
