const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    numberOfNights: {
      type: Number,
      required: true,
      min: 1,
    },
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

// Static method to check for overlapping bookings
bookingSchema.statics.checkOverlap = async function (
  listingId,
  checkIn,
  checkOut,
  excludeBookingId = null
) {
  const query = {
    listing: listingId,
    status: "confirmed", // Only check confirmed bookings
    $or: [
      // Case 1: New booking starts during existing booking
      {
        checkIn: { $lte: checkIn },
        checkOut: { $gt: checkIn },
      },
      // Case 2: New booking ends during existing booking
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gte: checkOut },
      },
      // Case 3: New booking completely contains existing booking
      {
        checkIn: { $gte: checkIn },
        checkOut: { $lte: checkOut },
      },
    ],
  };

  // Exclude current booking when updating
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlappingBooking = await this.findOne(query);
  return overlappingBooking !== null;
};

// Instance method to calculate total price
bookingSchema.methods.calculatePrice = function (pricePerNight) {
  const nights = Math.ceil(
    (this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24)
  );
  this.numberOfNights = nights;
  this.totalPrice = nights * pricePerNight;
  return this.totalPrice;
};

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
