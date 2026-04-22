const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const messageController = require("../controllers/message.js");

// All message routes require authentication
router.use(isLoggedIn);

// Show inbox
router.get("/", wrapAsync(messageController.showInbox));

// Get unread count (API endpoint)
router.get("/unread-count", wrapAsync(messageController.getUnreadCount));

// Show conversation with specific user
router.get(
  "/conversation/:userId",
  wrapAsync(messageController.showConversation)
);

// Send message
router.post("/", wrapAsync(messageController.sendMessage));

// Reply to message
router.post("/reply/:userId", wrapAsync(messageController.replyMessage));

// Delete message
router.delete("/:id", wrapAsync(messageController.deleteMessage));

module.exports = router;
