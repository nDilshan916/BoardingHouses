const express = require("express");
const Visit = require("../models/Visit");
const BoardingHouse = require("../models/BoardingHouse");
const router = express.Router();

const setVisit = async (req, res) => {
  try {
    const { boardingHouse, date, time } = req.body;

    const newVisit = new Visit({
      boardingHouse,
      user: req.user._id,
      date,
      time,
      status: "pending",
    });
    await newVisit.save();
    res.status(201).json(newVisit);
  } catch (error) {
    console.log("Error creating visit: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHolderVisit = async (req, res) => {
  try {
    if (req.user.role !== "holder") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const boardingHouses = await BoardingHouse.find({ user: req.user._id });
    const boardingHouseIds = boardingHouses.map((house) => house._id);
    const visits = await Visit.find({
      boardingHouse: { $in: boardingHouseIds },
    })
      .populate("boardingHouse")
      .populate("user");
    res.status(201).json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserVisit = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).send({ error: "Access Denied" });
    }

    const visits = await Visit.find({ user: req.user._id })
      .populate({
        path: "boardingHouse",
        populate: {
          path: "user",
          model: "user",
          select: "contactNumber",
        },
      })
      .populate("user");
    res.status(201).json(visits);
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateVisit = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const visitAppointments = await Visit.findById(id);
    visitAppointments.status = status;
    await visitAppointments.save();
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  setVisit,
  getHolderVisit,
  updateVisit,
  getUserVisit,
};
