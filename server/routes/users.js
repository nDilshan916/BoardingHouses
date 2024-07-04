const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const upload = multer({ dest: "uploads/" });

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    // check email is already exists
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already exists!" });

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Ensure you define SALT in your environment or use a fixed number here
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //save in the database
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const user = await User.find({});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log("Invalid user ID:", userId); // Debug log to check invalid IDs
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", upload.single("profilePicture"), async (req, res) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    let profilePictureUrl;

    // If a profile picture is uploaded, upload it to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile-pictures",
      });
      profilePictureUrl = result.secure_url;
    }

    // Update user data with the profile picture URL if available
    const updatedUserData = { ...req.body };
    if (profilePictureUrl) {
      updatedUserData.profilePictureUrl = profilePictureUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
