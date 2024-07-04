const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  setVisit,
  getHolderVisit,
  updateVisit,
  getUserVisit,
} = require("../controllers/visitController");

router.post("/", protect, setVisit);
router.get("/holder", protect, getHolderVisit);
router.get("/user", protect, getUserVisit);
router.put("/:id", protect, updateVisit);

module.exports = router;
