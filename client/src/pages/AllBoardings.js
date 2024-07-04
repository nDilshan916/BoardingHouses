import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import Ratings from "../components/FIlter/Ratings";
import GenderFilter from "../components/FIlter/GenderFilter";
import DistanceFilter from "../components/FIlter/DIstanceFilter";
import PriceSort from "../components/FIlter/PriceSort";
import UniFilter from "../components/FIlter/UniFilter";

const AllBoardings = () => {
  let { id } = useParams();
  const [boardings, setBoardings] = useState([]);
  const [rating, setRating] = useState(0);
  const [gender, setGender] = useState("both");
  const [selectedDistance, setSelectedDistance] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [uni, setUni] = useState("all");

  const fetchBoardings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/BoardingHouse/allboardings"
      );
      console.log("Fetched boardings:", response.data);
      const boardingsWithReviews = await Promise.all(
        response.data.map(async (bh) => {
          const reviewResponse = await axios.get(
            `http://localhost:5000/api/reviews/boardingHouse/${bh._id}`
          );
          return { ...bh, reviews: reviewResponse.data };
        })
      );

      setBoardings(boardingsWithReviews);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchBoardings();
  }, []);

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((acc, rating) => acc + rating, 0);
    return total / ratings.length;
  };

  const renderStars = (averageRating) => {
    const rating = Math.min(Math.max(Math.round(averageRating), 0), 5);
    const filledStars = rating;
    const emptyStars = 5 - filledStars;

    return (
      <>
        {[...Array(filledStars)].map((_, index) => (
          <span key={index} className="text-yellow-400 text-lg">
            ★
          </span>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={index} className="text-gray-300 text-lg">
            ☆
          </span>
        ))}
      </>
    );
  };

  const isWithinSelectedDistance = (distance) => {
    if (selectedDistance === "all") return true;
    const [min, max] = selectedDistance.split("-").map(Number);
    return distance >= min && distance <= max;
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  const filteredBoardings = boardings
    .filter((bh) => {
      const avgRating = calculateAverageRating(
        bh.reviews?.map((review) => review.rating)
      );
      const matchesRating = rating === 0 || Math.round(avgRating) === rating;
      const matchesGender = gender === "both" || bh.gender === gender;
      const matchesDistance = isWithinSelectedDistance(bh.distance);
      const matchUni = uni === "all" || bh.university === uni;
      return matchesRating && matchesGender && matchesDistance && matchUni;
    })
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") {
        return a.price - b.price;
      } else if (sortOrder === "highToLow") {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div>
      <Header />
      <div className="flex">
        <div className="w-[18%] border-r-4 p-4 overflow-y-auto h-screen sticky top-0">
          <Ratings setRating={setRating} />
          <GenderFilter gender={gender} setGender={setGender} />
          <DistanceFilter
            selectedDistance={selectedDistance}
            setSelectedDistance={setSelectedDistance}
          />
          <PriceSort sortOrder={sortOrder} setSortOrder={setSortOrder} />
          <UniFilter uni={uni} setUni={setUni} />
        </div>
        <div className="flex-1 pr-60 pl-60 pt-4 pb-4 bg-gray-50 min-h-screen">
          <div className="grid grid-cols-1 gap-8">
            {filteredBoardings.length > 0 ? (
              filteredBoardings.map((bh) => (
                <div
                  key={bh._id}
                  className="flex flex-col md:flex-row bg-white border-2 hover:border-blue-300 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden min-h-[160px]"
                >
                  <div className="w-60 h-full flex-shrink-0">
                    <img
                      src={bh.coverImage || "path/to/default/image.jpg"}
                      alt={bh.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:flex-1 p-4 flex flex-col justify-between">
                    <Link
                      to={`/boarding/${bh._id}`}
                      className="no-underline text-gray-900"
                    >
                      <h3 className="text-2xl font-bold mb-2 text-blue-600 hover:text-black">
                        {bh.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-[#1f3e72] mb-1">
                      Distance: {bh.distance} km from {bh.university}
                    </p>
                    <p className="text-sm text-gray-700 mb-3">
                      {truncateText(bh.description, 100)}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-lg">
                        {renderStars(
                          calculateAverageRating(
                            bh.reviews?.map((review) => review.rating)
                          )
                        )}
                      </span>
                      <span className="ml-2 text-sm text-gray-600">
                        ({bh.reviews ? bh.reviews.length : 0} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3">
                      Price: Rs {bh.price} Per Month
                    </p>
                    <p className="text-sm text-gray-700 mt-3">
                      This is for {bh.gender} students
                    </p>
                    <p
                      className={`text-sm mt-3 ${
                        bh.availability === "Available"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {bh.availability === "Available"
                        ? "Available"
                        : "Not Available"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-lg">
                No boarding houses found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBoardings;
