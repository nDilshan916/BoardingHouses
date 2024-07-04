import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header/Header";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const { _id } = useParams();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="text-yellow-500">
            &#9733;
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-400">
            &#9733;
          </span>
        );
      }
    }
    return stars;
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/reviews/boardingHouse/${_id}`
        );
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [_id]);

  return (
    <>
      <Header />
      <div className="text-gray-800 font-body p-6">
        <div className="container mx-auto">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Reviews</h1>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg mt-4">
                  <p className="font-semibold">
                    Rating: {renderStars(review.rating)}
                  </p>
                  <p className="mt-2">{review.comment}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Posted on: {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
            <Link
              to={`/boarding/${_id}`}
              className="text-blue-500 hover:underline mt-4 block"
            >
              Back to Boarding House
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewsPage;
