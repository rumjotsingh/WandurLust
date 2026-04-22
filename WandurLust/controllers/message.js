const Message = require("../models/message");
const User = require("../models/user");
const Listing = require("../models/listing");

// Show inbox (GET /messages)
module.exports.showInbox = async (req, res) => {
  const conversations = await Message.getInbox(req.user._id);

  res.render("messages/inbox.ejs", { conversations });
};

// Show conversation with specific user (GET /messages/conversation/:userId)
module.exports.showConversation = async (req, res) => {
  const { userId } = req.params;
  const otherUser = await User.findById(userId);

  if (!otherUser) {
    req.flash("error", "User not found");
    return res.redirect("/messages");
  }

  // Get all messages between these two users
  const messages = await Message.getConversation(req.user._id, userId);

  // Mark messages as read
  await Message.updateMany(
    {
      sender: userId,
      receiver: req.user._id,
      isRead: false,
    },
    { isRead: true }
  );

  res.render("messages/conversation.ejs", {
    messages,
    otherUser,
  });
};

// Show message form for listing (GET /listings/:id/contact)
module.exports.showContactForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Check if user is trying to message themselves
  if (listing.owner._id.equals(req.user._id)) {
    req.flash("error", "You cannot message yourself");
    return res.redirect(`/listings/${id}`);
  }

  res.render("messages/new.ejs", { listing });
};

// Send message (POST /messages)
module.exports.sendMessage = async (req, res) => {
  const { receiverId, listingId, subject, message } = req.body;

  // Validate receiver exists
  const receiver = await User.findById(receiverId);
  if (!receiver) {
    req.flash("error", "Recipient not found");
    return res.redirect("/messages");
  }

  // Check if user is trying to message themselves
  if (receiverId === req.user._id.toString()) {
    req.flash("error", "You cannot send a message to yourself");
    return res.redirect("/messages");
  }

  // Create message
  const newMessage = new Message({
    sender: req.user._id,
    receiver: receiverId,
    listing: listingId || null,
    subject: subject || "General Inquiry",
    message: message,
  });

  await newMessage.save();

  req.flash("Sucess", "Message sent successfully!");

  // Redirect based on context
  if (listingId) {
    res.redirect(`/listings/${listingId}`);
  } else {
    res.redirect(`/messages/conversation/${receiverId}`);
  }
};

// Reply to message (POST /messages/reply/:userId)
module.exports.replyMessage = async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  // Validate receiver exists
  const receiver = await User.findById(userId);
  if (!receiver) {
    req.flash("error", "Recipient not found");
    return res.redirect("/messages");
  }

  // Create message
  const newMessage = new Message({
    sender: req.user._id,
    receiver: userId,
    message: message,
    subject: "Reply",
  });

  await newMessage.save();

  res.redirect(`/messages/conversation/${userId}`);
};

// Delete message (DELETE /messages/:id)
module.exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  const message = await Message.findById(id);

  if (!message) {
    req.flash("error", "Message not found");
    return res.redirect("/messages");
  }

  // Only sender or receiver can delete
  if (
    !message.sender.equals(req.user._id) &&
    !message.receiver.equals(req.user._id)
  ) {
    req.flash("error", "You don't have permission to delete this message");
    return res.redirect("/messages");
  }

  await Message.findByIdAndDelete(id);
  req.flash("Sucess", "Message deleted");
  res.redirect("/messages");
};

// Get unread message count (for navbar badge)
module.exports.getUnreadCount = async (req, res) => {
  if (!req.user) {
    return res.json({ count: 0 });
  }

  const count = await Message.countDocuments({
    receiver: req.user._id,
    isRead: false,
  });

  res.json({ count });
};
