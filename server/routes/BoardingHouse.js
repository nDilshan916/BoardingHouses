const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporary storage
const BoardingHouse = require("../models/BoardingHouse");
const cloudinary = require("../utils/cloudinary");

router.post(
  "/upload",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "otherFiles", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, distance, description, gender, price, university } =
        req.body;
      let coverImageResult = "";
      let otherImagesResults = [];

      // Upload cover image to the 'coverImages' folder
      if (req.files.coverImage && req.files.coverImage.length > 0) {
        const path = req.files.coverImage[0].path;
        coverImageResult = await cloudinary.uploader.upload(path, {
          folder: "coverImages",
        });
      }

      // Upload other images to the 'otherImages' folder
      if (req.files.otherFiles) {
        for (const file of req.files.otherFiles) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "otherImages",
          });
          otherImagesResults.push(result.url);
        }
      }

      // Create a new boarding house entry
      const newBoardingHouse = new BoardingHouse({
        name,
        distance,
        description,
        gender,
        price,
        university,
        coverImage: coverImageResult.url, // Store URL
        otherImages: otherImagesResults, // Store an array of URLs
      });

      // Save the boarding house to database
      await newBoardingHouse.save();

      res.status(201).send("Boarding house created successfully");
    } catch (error) {
      console.error("Error creating boarding house: ", error);
      res.status(500).send(error.message);
    }
  }
);

// Get a single boarding house by ID
router.get("/:id", async (req, res) => {
  const boardingHouseId = req.params.id;

  try {
    const boardingHouse = await BoardingHouse.findById(boardingHouseId);
    if (!boardingHouse) {
      return res.status(404).json({ message: "Boarding house not found" });
    }
    res.json(boardingHouse);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get boarding houses by university name
router.get("/university/:universityName", async (req, res) => {
  const decodedUniversityName = decodeURIComponent(req.params.universityName);

  try {
    const boardings = await BoardingHouse.find({
      university: decodedUniversityName,
    });

    if (boardings.length > 0) {
      res.json(boardings);
    } else {
      res.status(404).json({ message: "No boarding houses found" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Get all boarding houses
router.get("/", async (req, res) => {
  try {
    const boardings = await BoardingHouse.find({});
    res.json(boardings);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/update-boarding/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const boarding = await BoardingHouse.findById(id);
    if (!boarding) {
      return res
        .status(404)
        .json({ message: "No boarding house found with the given ID." });
    }
    res.json(boarding);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put(
  "/update-boarding/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "otherFiles", maxCount: 10 },
  ]),
  async (req, res) => {
    const id = req.params.id;

    try {
      // Fetch the existing boarding house
      const existingBoardingHouse = await BoardingHouse.findById(id);
      if (!existingBoardingHouse) {
        return res.status(404).json({ message: "Boarding house not found" });
      }

      let updateData = {
        name: req.body.name,
        distance: req.body.distance,
        description: req.body.description,
        gender: req.body.gender,
        price: req.body.price,
        university: req.body.university,
      };

      // Update cover image if provided
      if (req.files.coverImage && req.files.coverImage.length > 0) {
        const path = req.files.coverImage[0].path;
        const coverImageResult = await cloudinary.uploader.upload(path, {
          folder: "coverImages",
        });
        updateData.coverImage = coverImageResult.url;
      }

      // Initialize otherImages with existing ones
      updateData.otherImages = existingBoardingHouse.otherImages || [];

      // Update other images if provided
      if (req.files.otherFiles) {
        for (const file of req.files.otherFiles) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "otherImages",
          });
          updateData.otherImages.push(result.url);
        }
      }

      const updatedBoardingHouse = await BoardingHouse.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      res.json({
        message: "Boarding house updated successfully",
        boardingHouse: updatedBoardingHouse,
      });
    } catch (error) {
      console.error("Error updating boarding house:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.delete("/:id", async (req, res) => {
  const boardingHouseId = req.params.id;

  try {
    const boardingHouse =
      await BoardingHouse.findByIdAndDelete(boardingHouseId);
    if (!boardingHouse) {
      return res.status(404).json({ message: "Boarding house not found" });
    }
    res.json(boardingHouse);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
