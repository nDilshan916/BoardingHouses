import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateBoarding = () => {
  const { id } = useParams();
  const [boardings, setBoardings] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [otherFiles, setOtherFiles] = useState([]);
  const [otherFilesUrls, setOtherFilesUrls] = useState([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/BoardingHouse/update-boarding/${id}`
        );
        if (response.data) {
          const { data } = response;
          setFormData({
            name: data.name,
            distance: data.distance,
            description: data.description,
            gender: data.gender,
            price: data.price,
            university: data.university,
            address: data.address,
          });
          setCoverImageUrl(data.coverImage);

          // Assuming data.otherFiles is an array of URLs
          const otherFilesUrls = data.otherImages.map((file) => ({
            url: file, // Assuming file is just a string URL, adjust if it's an object
            type: file.includes(".mp4") ? "video/mp4" : "image", // Adjust logic as needed
          }));
          setOtherFilesUrls(otherFilesUrls);
        } else {
          toast.info("No boarding house data found for the provided ID.");
        }
      } catch (error) {
        toast.error(
          "Error fetching data: " +
            (error.response ? error.response.data.message : error.message)
        );
      }
    };

    fetchData();
  }, [id]);
  const [formData, setFormData] = useState({
    name: "",
    distance: "",
    description: "",
    gender: "",
    price: "",
    university: "",
    address: "",
  });

  const [message, setMessage] = useState("");

  const universities = [
    "Wayamba University of Sri Lanka",
    "University of Peradeniya",
    "University of Kelaniya",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverImage(file);
      const url = URL.createObjectURL(file);
      setCoverImageUrl(url);
      console.log("Cover Image URL:", url);
    }
  };

  const handleFileChange = (event) => {
    console.log("Handling file change");
    const files = Array.from(event.target.files);
    const newUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setOtherFiles((prevFiles) => [...prevFiles, ...files]);
    setOtherFilesUrls((prevUrls) => [...prevUrls, ...newUrls]);
    console.log("New Other Files URLs:", newUrls);
  };

  const handleGenderChange = (event) => {
    setFormData((prev) => ({ ...prev, gender: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (coverImage) {
      formDataToSend.append("coverImage", coverImage);
    } else {
      // If no new cover image, consider sending the URL of the existing image
      formDataToSend.append("coverImage", coverImageUrl);
    }
    otherFiles.forEach((file) => {
      formDataToSend.append("otherFiles", file);
    });

    try {
      const response = await axios.put(
        `http://localhost:5000/api/BoardingHouse/update-boarding/${id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Boarding house updated successfully!");

      if (response.data && response.data.boardingHouse) {
        console.log(response.data.boardingHouse.otherImages); // Ensure you have the correct data
        const images = response.data.boardingHouse.otherImages || []; // Fallback to an empty array if undefined
        setOtherFilesUrls(
          images.map((file) => ({
            url: file,
            type: file.includes(".mp4") ? "video/mp4" : "image/jpeg",
          }))
        );
      }
    } catch (error) {
      toast.error(
        "Error updating form: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Distance from University:
          </label>
          <input
            type="text"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-md h-32"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Cover Image:
          </label>
          {coverImageUrl && (
            <img
              src={coverImageUrl}
              alt="Cover"
              style={{ width: "20%", marginBottom: "10px" }}
            />
          )}
          <input
            type="file"
            name="coverImage"
            onChange={handleImageChange}
            accept="image/*"
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex gap-4 items-center">
          <label className="text-lg font-semibold text-gray-700">Gender:</label>
          <div>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleGenderChange}
                className="text-blue-600"
              />
              <span className="ml-2">Male</span>
            </label>
            <label className="inline-flex items-center ml-6">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleGenderChange}
                className="text-pink-600"
              />
              <span className="ml-2">Female</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Other Images and Videos:
          </label>
          {otherFilesUrls.map((file, index) => (
            <div key={index}>
              {file.type.startsWith("video") ? (
                <video controls width="250">
                  <source src={file.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={file.url}
                  alt="Preview"
                  style={{ width: "20%", height: "auto" }}
                />
              )}
            </div>
          ))}
          <input
            type="file"
            name="otherFiles"
            multiple
            onChange={handleFileChange}
            accept="image/*,video/*"
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Price for One Month:
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            Address of the Boarding House:
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-lg font-semibold text-gray-700">
            University:
          </label>
          <select
            name="university"
            value={formData.university}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
          >
            <option value="">-- Select University --</option>
            {universities.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-gradient text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
        {message && (
          <div className="mt-4 text-center text-sm font-medium text-red-500">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateBoarding;
