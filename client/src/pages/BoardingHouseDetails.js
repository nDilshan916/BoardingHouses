import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header";

function BoardingHouseDetails() {
  const [boardingHouse, setBoardingHouse] = useState(null);
  const [location, setLocation] = useState({ lat: 7.2906, lng: 80.6337 }); // Default location (Kandy)
  const { _id } = useParams();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [numPersons, setNumPersons] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // State to store fetched reviews
  const [lastThreeReviews, setLastThreeReviews] = useState([]);

  useEffect(() => {
    const fetchBoardingHouse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/BoardingHouse/${_id}`
        );
        setBoardingHouse(response.data);
        if (response.data.location) {
          setLocation(response.data.location); // If location data is available
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching boarding house:", error);
        setError("Failed to fetch boarding house details.");
        setLoading(false);
      }
    };

    fetchBoardingHouse();
  }, [_id]);

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
        setLastThreeReviews(response.data.slice(-3));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    if (boardingHouse) {
      fetchReviews();
    }
  }, [boardingHouse, _id]);

  const images = boardingHouse?.otherImages.map((image) => ({
    original: image,
    thumbnail: image,
  }));

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/requests`, {
        boardingHouseId: _id,
        numPersons,
      });
      alert("Request sent successfully!");
      setShowRequestForm(false);
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Header />
      <div className="text-gray-800 font-body p-6">
        {boardingHouse ? (
          <div className="container mx-auto">
            <div className="p-6 bg-white shadow-lg rounded-lg">
              <h1 className="text-3xl font-bold mb-4">{boardingHouse.name}</h1>
              <p className="text-lg text-gray-600 mb-6">
                98 Colombo Street, Kandy, Sri Lanka
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="w-full">
                  <ImageGallery items={images} showThumbnails={true} />
                </div>
                <div className="space-y-6">
                  <div className="bg-white shadow-lg p-6 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-500">
                        8.2
                      </span>
                      <span className="text-lg text-gray-600 ml-2">
                        Very Good
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {reviews.length} reviews
                    </p>
                  </div>

                  <div className="bg-white shadow-lg p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">Location</h2>
                    <div className="w-full h-48 bg-gray-300 rounded-lg">
                      <MapContainer
                        center={[location.lat, location.lng]}
                        zoom={13}
                        scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[location.lat, location.lng]}>
                          <Popup>{boardingHouse.name}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>

                  <div className="bg-white shadow-lg p-6 rounded-lg mt-6">
                    <h3 className="text-2xl font-bold border-b-2 pb-2 border-gray-200">
                      Description
                    </h3>
                    <p className="bg-gray-100 p-4 rounded-lg mt-4">
                      {boardingHouse.description}
                    </p>
                  </div>

                  <div className="bg-white shadow-lg p-6 rounded-lg mt-6">
                    <h3 className="text-2xl font-bold border-b-2 pb-2 border-gray-200">
                      Reviews
                    </h3>
                    {lastThreeReviews.length > 0 ? (
                      lastThreeReviews.map((review, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 p-4 rounded-lg mt-4"
                        >
                          <p>Rating: {renderStars(review.rating)}</p>
                          <p>Comment: {review.comment}</p>
                          <p>
                            Created At:{" "}
                            {new Date(review.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet.</p>
                    )}
                    <h4>
                      <Link
                        to={`/reviews/${_id}`}
                        className="text-blue-500 hover:underline mt-4 block"
                      >
                        View All Reviews
                      </Link>
                    </h4>
                  </div>

                  <div className="bg-white shadow-lg p-6 rounded-lg mt-6">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                      onClick={() =>
                        alert(
                          "Schedule Visit functionality is not yet implemented."
                        )
                      }
                    >
                      Schedule Visit
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => setShowRequestForm(true)}
                    >
                      Request Boarding House
                    </button>
                  </div>

                  {showRequestForm && (
                    <div className="bg-white shadow-lg p-6 rounded-lg mt-6">
                      <h3 className="text-xl font-bold mb-4">
                        Request Boarding House
                      </h3>
                      <form onSubmit={handleRequestSubmit}>
                        <div className="mb-4">
                          <label
                            htmlFor="numPersons"
                            className="block text-gray-700 font-bold mb-2"
                          >
                            Number of Persons
                          </label>
                          <input
                            type="number"
                            id="numPersons"
                            value={numPersons}
                            onChange={(e) => setNumPersons(e.target.value)}
                            className="border border-gray-300 rounded p-2 w-full"
                            min="1"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          Submit Request
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default BoardingHouseDetails;
