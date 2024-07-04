import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VisitSchedule = ({ boardingHouseId }) => {
  //  const { boardingHouseId } = useParams();
  const [startDate, setStartDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}.${minutes}`;
  };

  const handleSubmit = async () => {
    const formattedDate = formatDate(startDate);
    const formattedTime = formatTime(time);

    try {
      await axios.post(
        "http://localhost:5000/api/visit",
        {
          boardingHouse: boardingHouseId,
          date: formattedDate,
          time: formattedTime,
          user: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Visit scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling visit:", error);
      toast.error("Failed to schedule visit.");
    }
  };

  return (
    <div className="visit-scheduler p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-[#1f3e72]">
        Schedule a Visit
      </h2>
      <div className="datepicker-container mb-4">
        <label className="block text-gray-700 mb-2">Select Date:</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
          dateFormat="yyyy/MM/dd"
        />
      </div>
      <div className="timepicker-container mb-4">
        <label className="block text-gray-700 mb-2">Select Time:</label>
        <DatePicker
          selected={time}
          onChange={(time) => {
            setTime(time);
          }}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={() => {
          handleSubmit();
        }}
        className="w-full bg-blue-gradient text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Schedule Visit
      </button>
    </div>
  );
};

export default VisitSchedule;
