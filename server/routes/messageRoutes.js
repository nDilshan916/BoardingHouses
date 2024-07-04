const express = require("express");
const { setMessage, getMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/send/:id", protect, setMessage);
router.get("/:id", protect, getMessages);

module.exports = router;
