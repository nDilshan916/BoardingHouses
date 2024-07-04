const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const BoardingHouse = require("../models/BoardingHouse");

// POST submit review
router.post("/:boardingHouseId/reviews", async (req, res) => {
  const { boardingHouseId } = req.params;
  const { rating, comment } = req.body;

  try {
    // Create a new review
    const review = new Review({
      boardingHouse: boardingHouseId,
      rating,
      comment,
    });

    // Save the review
    await review.save();

    // Find the boarding house and update its reviews array
    await BoardingHouse.findByIdAndUpdate(
      boardingHouseId,
      {
        $push: { reviews: review._id },
      },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET all reviews for a specific boarding house
router.get("/boardingHouse/:boardingHouseId", async (req, res) => {
  const { boardingHouseId } = req.params;

  try {
    const reviews = await Review.find({ boardingHouse: boardingHouseId }).sort({
      createdAt: -1,
    }); // Sort by descending order of creation date
    // Limit the number of reviews fetched per page

    if (!reviews) {
      return res
        .status(404)
        .json({ error: "No reviews found for this boarding house" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
