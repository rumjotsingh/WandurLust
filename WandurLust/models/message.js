const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      default: null, // Optional - message can be about a specific listing
    },
    subject: {
      type: String,
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
messageSchema.index({ receiver: 1, createdAt: -1 });
messageSchema.index({ sender: 1, receiver: 1 });

// Static method to get conversation between two users
messageSchema.statics.getConversation = async function (user1Id, user2Id) {
  return this.find({
    $or: [
      { sender: user1Id, receiver: user2Id },
      { sender: user2Id, receiver: user1Id },
    ],
  })
    .populate("sender", "username email")
    .populate("receiver", "username email")
    .populate("listing", "title location")
    .sort({ createdAt: 1 });
};

// Static method to get inbox with latest message from each conversation
messageSchema.statics.getInbox = async function (userId) {
  const messages = await this.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { receiver: userId }],
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$sender", userId] },
            "$receiver",
            "$sender",
          ],
        },
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$receiver", userId] },
                  { $eq: ["$isRead", false] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $sort: { "lastMessage.createdAt": -1 },
    },
  ]);

  // Populate user details
  await this.populate(messages, [
    { path: "_id", select: "username email" },
    { path: "lastMessage.sender", select: "username email" },
    { path: "lastMessage.receiver", select: "username email" },
    { path: "lastMessage.listing", select: "title location" },
  ]);

  return messages;
};

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
