// routes/requestRoute.js
const express = require("express");
const router = express.Router();
const Request = require("../models/request");
const BoardingHouse = require("../models/BoardingHouse");
const { User } = require("../models/user");

const setRequest = async (req, res) => {
  try {
    const { boardingHouseId, numPersons, totalPrice } = req.body;
    const boardingHouse = await BoardingHouse.findById(boardingHouseId);
    if (!boardingHouse) {
      return res
        .status(404)
        .json({ message: "Boarding House Not Found When requesting" });
    }

    const newRequest = new Request({
      boardingHouse: boardingHouseId,
      numPersons,
      totalPrice,
      status: "pending",
      user: req.user._id,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHolderRequest = async (req, res) => {
  try {
    if (req.user.role !== "holder") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const boardingHouses = await BoardingHouse.find({ user: req.user._id });
    const boardingHouseIds = boardingHouses.map((house) => house._id);
    const holderRequest = await Request.find({
      boardingHouse: { $in: boardingHouseIds },
    })
      .populate("boardingHouse")
      .populate("user"); // Ensure the field name matches the schema

    res.status(201).json(holderRequest);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserRequest = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const holderRequest = await Request.find({ user: req.user._id })
      .populate("boardingHouse")
      .populate("user"); // Ensure the field name matches the schema

    res.status(201).json(holderRequest);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRequest = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    if (req.user.role !== "holder") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const request = await Request.findById(id);
    const boardingHouse = await BoardingHouse.findById(request.boardingHouse);
    if (boardingHouse.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "Unauthorized" });
    }
    request.status = status;
    await request.save();

    res.json({ message: "Request status updated", request });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  setRequest,
  getHolderRequest,
  updateRequest,
  getUserRequest,
};
