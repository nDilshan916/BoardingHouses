import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import universities from "../data/UniData";

function UniversityPage() {
  let { id } = useParams();
  const [boardings, setBoardings] = useState([]);
  const university = universities.find((uni) => uni.id.toString() === id);

  useEffect(() => {
    if (university) {
      console.log("Fetching boardings for:", university.name);
      fetchBoardings();
    }
  }, [university]);

  const fetchBoardings = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/BoardingHouse/university/${encodeURIComponent(university.name)}`
      );
      console.log("Fetched boardings:", response.data);
      setBoardings(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
   

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {university ? (
        <h2 className="text-3xl font-bold text-gray-800 my-6 text-center">
          Boarding Houses near {university.name}
        </h2>
      ) : (
        <h2 className="text-3xl font-bold text-red-500 text-center my-6">
          University not found
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-center gap-6">
        {boardings.length > 0 ? (
          boardings.map((bh) => (
            <div
              key={bh._id}
              className="flex flex-col md:flex-row bg-white border-2 hover:border-blue-300 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden h-full"
            >
              <div className="w-2/5">
                <img
                  src={bh.coverImage || "path/to/default/image.jpg"}
                  alt={bh.name}
                  className="w-60 h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-4 flex flex-col justify-between">
                <Link
                  to={`/boarding/${bh._id}`}
                  className="no-underline text-gray-900"
                >
                  <h3 className="text-xl font-bold mb-2  text-blue-600  hover:text-black">
                    {bh.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-1">
                  Distance: {bh.distance} km from {university.name}
                </p>
                <p className="text-sm text-gray-700 mb-3">{bh.description}</p>
                {/* Placeholder for review system */}
                <div className="flex items-center">
                  <span className="text-yellow-400 text-lg">
                    {/* Simple static star icons for illustration */}
                    ★★★★☆
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    (200 reviews)
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-600 text-lg">No boarding houses found.</div>
        )}
      </div>
    </div>
  );
}

export default UniversityPage;
