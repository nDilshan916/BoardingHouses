import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserReview = () => {
  const [boardingHouses, setBoardingHouses] = useState([]);
  const [selectedBoardingHouseId, setSelectedBoardingHouseId] = useState("");
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");
  const [reviewData, setReviewData] = useState({
    rating: "",
    comment: "",
    boardingHouseId: "",
  });

  useEffect(() => {
    const fetchBoardingHouses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/BoardingHouse/allboardings"
        );
        setBoardingHouses(response.data);
      } catch (error) {
        toast.error("Error fetching boarding houses: " + error.message);
      }
    };

    fetchBoardingHouses();
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request/user",
          config
        );
        setRequests(response.data);
        if (response.data.length > 0) {
          setSelectedBoardingHouseId(response.data[0].boardingHouse._id);
          setReviewData((prevData) => ({
            ...prevData,
            boardingHouseId: response.data[0].boardingHouse._id,
          }));
        }
      } catch (error) {
        console.log("Error fetching holder request", error);
      }
    };
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevReviewData) => ({
      ...prevReviewData,
      [name]: value,
    }));
  };

  const submitReview = async () => {
    if (!selectedBoardingHouseId) {
      toast.error("Please select a boarding house.");
      return;
    }

    if (!reviewData.rating || !reviewData.comment) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/reviews/${selectedBoardingHouseId}/reviews`,
        reviewData
      );

      if (response.data) {
        toast.success("Review submitted successfully");
        setReviewData({ rating: "", comment: "", boardingHouseId: "" }); // Reset form
      }
    } catch (error) {
      toast.error("Error submitting review: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Submit a Review</h2>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="boardingHouse"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Your Boarding House
          </label>
          {requests.map((request) => (
            <div key={request.boardingHouse._id}>
              <input
                type="text"
                name="boardingHouse"
                value={request.boardingHouse.name}
                className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                readOnly
              />
              <input
                type="hidden"
                name="boardingHouseId"
                value={request.boardingHouse._id}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <div>
          <label
            htmlFor="rating"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Rating
          </label>
          <select
            name="rating"
            value={reviewData.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="" hidden>
              Select rating
            </option>
            <option value={1}>★ - Very Poor</option>
            <option value={2}>★★ - Poor</option>
            <option value={3}>★★★ - Average</option>
            <option value={4}>★★★★ - Good</option>
            <option value={5}>★★★★★ - Excellent</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="comment"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Comment
          </label>
          <textarea
            name="comment"
            value={reviewData.comment}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            rows="4"
          ></textarea>
        </div>
        <div>
          <button
            type="button"
            onClick={submitReview}
            className="w-full bg-blue-gradient text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserReview;
