const mongoose = require("mongoose");

const boardingHouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    distance: {
      type: String,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    coverImage: {
      type: String,
      required: true,
    },
    otherImages: {
      type: [String],
      default: [],
    },
    university: {
      type: String,
      required: true,
      message: "Please select a university",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        
      }
    ]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const BoardingHouse = mongoose.model("BoardingHouse", boardingHouseSchema);

module.exports = BoardingHouse;
