const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Show booking form (GET /listings/:id/book)
module.exports.showBookingForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Check if user is trying to book their own listing
  if (listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing");
    return res.redirect(`/listings/${id}`);
  }

  res.render("bookings/new.ejs", { listing });
};

// Create new booking (POST /listings/:id/book)
module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, guests } = req.body;

  // Validate dates
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (checkInDate < today) {
    req.flash("error", "Check-in date cannot be in the past");
    return res.redirect(`/listings/${id}/book`);
  }

  if (checkOutDate <= checkInDate) {
    req.flash("error", "Check-out date must be after check-in date");
    return res.redirect(`/listings/${id}/book`);
  }

  // Find listing
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Check if user is trying to book their own listing
  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "You cannot book your own listing");
    return res.redirect(`/listings/${id}`);
  }

  // Check for overlapping bookings
  const hasOverlap = await Booking.checkOverlap(id, checkInDate, checkOutDate);
  if (hasOverlap) {
    req.flash(
      "error",
      "This property is already booked for the selected dates. Please choose different dates."
    );
    return res.redirect(`/listings/${id}/book`);
  }

  // Calculate nights and total price
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );
  const totalPrice = nights * listing.price;

  // Create booking
  const booking = new Booking({
    user: req.user._id,
    listing: id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
    numberOfNights: nights,
    guests: guests || 1,
    status: "confirmed",
  });

  await booking.save();

  req.flash("Sucess", "Booking confirmed successfully!");
  res.redirect(`/bookings/${booking._id}`);
};

// Show all user bookings (GET /bookings)
module.exports.showUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/index.ejs", { bookings });
};

// Show single booking details (GET /bookings/:id)
module.exports.showBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id)
    .populate("user")
    .populate({
      path: "listing",
      populate: { path: "owner" },
    });

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/bookings");
  }

  // Check if user owns this booking
  if (!booking.user._id.equals(req.user._id)) {
    req.flash("error", "You don't have permission to view this booking");
    return res.redirect("/bookings");
  }

  res.render("bookings/show.ejs", { booking });
};

// Cancel booking (DELETE /bookings/:id)
module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/bookings");
  }

  // Check if user owns this booking
  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You don't have permission to cancel this booking");
    return res.redirect("/bookings");
  }

  // Check if booking can be cancelled (not in the past)
  const today = new Date();
  if (booking.checkIn < today && booking.status === "confirmed") {
    req.flash("error", "Cannot cancel a booking that has already started");
    return res.redirect(`/bookings/${id}`);
  }

  booking.status = "cancelled";
  await booking.save();

  req.flash("Sucess", "Booking cancelled successfully");
  res.redirect("/bookings");
};

// Show host's bookings (GET /bookings/host)
module.exports.showHostBookings = async (req, res) => {
  // Find all listings owned by current user
  const userListings = await Listing.find({ owner: req.user._id });
  const listingIds = userListings.map((listing) => listing._id);

  // Find all bookings for these listings
  const bookings = await Booking.find({ listing: { $in: listingIds } })
    .populate("user", "username email")
    .populate("listing")
    .sort({ createdAt: -1 });

  res.render("bookings/host.ejs", { bookings });
};
