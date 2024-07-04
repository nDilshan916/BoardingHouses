const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  boardingHouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BoardingHouse",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accept", "reject"],
    default: "pending",
  },
});

const Visit = mongoose.model("Visit", visitSchema);
module.exports = Visit;
