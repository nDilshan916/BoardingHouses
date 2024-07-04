import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../components/Header/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import VisitSchedule from "./VisitSchedule";

function BoardingHouseDetails() {
  const [boardingHouse, setBoardingHouse] = useState(null);
  const [location, setLocation] = useState({ lat: 7.2906, lng: 80.6337 });
  const { _id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [numPersons, setNumPersons] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [lastThreeReviews, setLastThreeReviews] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchBoardingHouse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/BoardingHouse/specificboarding?id=${_id}`
        );
        setBoardingHouse(response.data);
        if (response.data.location) {
          setLocation(response.data.location);
        }
        setTotalPrice(response.data.price); // Set initial total price
      } catch (error) {
        console.error("Error fetching boarding house:", error);
      }
    };

    fetchBoardingHouse();
  }, [_id]);

  const handleNumPersonsChange = (e) => {
    const num = e.target.value;
    setNumPersons(num);
    setTotalPrice(num * boardingHouse.price);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/request`,
        {
          boardingHouseId: _id,
          numPersons,
          totalPrice,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Request sent successfully!");
      setShowRequestForm(false);
    } catch (error) {
      console.error("Error sending request:", error);

      if (!user) {
        toast.warning("Required an account");
      } else {
        toast.error("Failed to send request.");
      }
    }
  };

  const goToVistSchedule = (boardingHouseId) => {
    navigate(`/vist-schedule/${boardingHouseId}`);
  };

  const goToChatToHolder = (receiverId) => {
    navigate(`/chat-holder/${receiverId}`);
  };

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

  return (
    <>
      <Header />
      <div className="text-gray-800 font-body p-6">
        <ToastContainer />
        {boardingHouse ? (
          <>
            <div className="max-w-screen-xl mx-auto">
              <h1 className="text-3xl text-[#1f3e72] font-bold mb-2">
                {boardingHouse.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {boardingHouse.address}
              </p>

              <div className="grid gap-4 grid-cols-2 mb-2">
                <div className="w-full">
                  <ImageGallery items={images} showThumbnails={true} />
                  <div className="bg-white border p-6 rounded-lg mt-2">
                    <h3 className="text-2xl text-[#1f3e72] font-bold mb-4">
                      Contact Details
                    </h3>
                    <p className="text-gray-700  mb-2">
                      {" "}
                      contact number: {boardingHouse.user.contactNumber}
                      <button
                        className="bg-blue-gradient  text-white  py-1 px-3 rounded-md shadow-lg ml-48"
                        onClick={() => goToChatToHolder(boardingHouse.user._id)}
                      >
                        Contact Holder
                      </button>
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border p-6 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-blue-500">
                        8.2
                      </span>
                      <span className="text-lg text-[#1f3e72] ml-2">
                        Very Good
                      </span>
                    </div>
                    <p className="text-sm text-[#1f3e72]">
                      {reviews.length} reviews
                    </p>
                    <div className="bg-white border p-6 rounded-lg mb-6 h-64 overflow-y-auto">
                      <h3 className="text-2xl font-bold border-b-2 pb-1 border-gray-200">
                        Review
                      </h3>
                      {reviews.length > 0 ? (
                        <div className="bg-gray-100 p-2 rounded-lg mt-2 text-sm">
                          <p>Rating: {renderStars(reviews[0].rating)}</p>
                          <p>Comment: {reviews[0].comment}</p>
                          <p>
                            Date:{" "}
                            {new Date(reviews[0].createdAt).toLocaleString()}
                          </p>
                        </div>
                      ) : (
                        <p>No reviews yet.</p>
                      )}
                      <h4>
                        <Link
                          to={`/reviews/${_id}`}
                          className="text-blue-500 hover:underline mt-2 block text-lg"
                        >
                          View All Reviews
                        </Link>
                      </h4>
                    </div>
                  </div>
                  <div className="bg-white border p-6 rounded-lg">
                    <h2 className="text-2xl text-[#1f3e72] font-bold mb-2">
                      Location
                    </h2>
                    <div className="w-full h-48 bg-gray-300 rounded-lg map-container">
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
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2 ">
                <div className="bg-white border p-6 rounded-lg mb-6">
                  <VisitSchedule boardingHouseId={boardingHouse._id} />
                </div>
                <div className="bg-white border pl-4 pr-4 rounded-lg mb-4 mt-2">
                  <div className="bg-white shadow-md p-2 rounded-lg mt-12 mb-6">
                    <h3 className="text-2xl text-[#1f3e72] font-bold mb-4">
                      Reserve A Boarding House
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Price Per Month : Rs {boardingHouse.price}
                    </p>

                    <form onSubmit={handleRequestSubmit}>
                      <div className="mb-4">
                        <label
                          htmlFor="numPersons"
                          className="block text-gray-700 mb-3"
                        >
                          Number of Persons :
                        </label>
                        <input
                          type="number"
                          id="numPersons"
                          value={numPersons}
                          onChange={handleNumPersonsChange}
                          className="border border-gray-300 rounded p-2 w-full"
                          min="1"
                          required
                        />
                      </div>
                      <p className="text-gray-700 mb-3">
                        Total Price : Rs {totalPrice}
                      </p>
                      <div className="flex flex-col items-center">
                        <button
                          type="submit"
                          className="bg-blue-gradient hover:bg-blue-400 text-white px-4 py-2 rounded mt-3"
                        >
                          Reserve
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="bg-white border p-6 rounded-lg mb-6 mt-4 h-64 overflow-y-auto ">
                <h3 className="text-2xl text-[#1f3e72] font-bold border-b-2 pb-2 mb-2 border-gray-200 ">
                  Description
                </h3>
                <p className="bg-gray-100 p-auto rounded-lg m-auto">
                  {boardingHouse.description}
                </p>
              </div>

              <div className="fixed bottom-8 right-6">
                <button
                  className="bg-blue-gradient  text-white font-bold py-2 px-4 rounded-md shadow-lg"
                  onClick={() => goToChatToHolder(boardingHouse.user._id)}
                >
                  <FontAwesomeIcon icon={faComments} size="2x" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default BoardingHouseDetails;
