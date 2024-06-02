require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db"); // Import the connection function
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const boardingRoutes = require("./routes/BoardingHouse");
const holderProfileRoutes = require("./routes/holderProfileRoute");
const reviewRoutes = require("./routes/reviewRoutes"); // Correct import

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/BoardingHouse", boardingRoutes);
app.use("/api/holderProfileRoute", holderProfileRoutes);
app.use("/api/reviews", reviewRoutes); // Correct usage

// Static React build
app.use(express.static("./client/build"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
