const express = require("express");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudcongigration.js");
const upload = multer({ storage });
const listingcontrollers = require("../controllers/listing.js");
const bookingController = require("../controllers/booking.js");
const messageController = require("../controllers/message.js");

// Search route - must come before /:id routes
router.get("/search", wrapAsync(listingcontrollers.search));

router
  .route("/")
  .get(wrapAsync(listingcontrollers.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontrollers.create)
  );

//new route
router.get("/new", isLoggedIn, listingcontrollers.new);

// Booking routes for specific listing
router.get("/:id/book", isLoggedIn, wrapAsync(bookingController.showBookingForm));
router.post("/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));

// Contact host route
router.get("/:id/contact", isLoggedIn, wrapAsync(messageController.showContactForm));

router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingcontrollers.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingcontrollers.delete))
  .get(wrapAsync(listingcontrollers.show));
//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontrollers.edit)
);
module.exports = router;
