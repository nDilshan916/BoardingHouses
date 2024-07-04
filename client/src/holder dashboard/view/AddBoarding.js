import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCloseSharp } from "react-icons/io5";

const AddBoarding = () => {
  const [formData, setFormData] = useState({
    name: "",
    distance: "",
    description: "",
    gender: "",
    price: "",
    university: "",
    address: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [otherFiles, setOtherFiles] = useState([]);
  const [otherFilesUrls, setOtherFilesUrls] = useState([]);
  const [message, setMessage] = useState("");

  const universities = [
    "Wayamba University of Sri Lanka",
    "University of Peradeniya",
    "University of Kelaniya",
    "Rajarata University of Sri Lanka",
    "Sabaragamuwa University of Sri Lanka",
    "University of Colombo",
    "University of Ruhuna",
    "University of Jaffna",
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
    const files = Array.from(event.target.files);
    setOtherFiles((prevFiles) => [...prevFiles, ...files]); // update state for actual file objects
    const filesWithUrls = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setOtherFilesUrls((prevUrls) => [...prevUrls, ...filesWithUrls]);
  };

  const handleGenderChange = (event) => {
    setFormData((prev) => ({ ...prev, gender: event.target.value }));
  };

  const removeImage = () => {
    setCoverImageUrl(null); // Remove the image URL from the state
  };

  const removeFile = (index) => {
    const updatedFiles = otherFilesUrls.filter((_, idx) => idx !== index);
    setOtherFilesUrls(updatedFiles);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      distance: "",
      description: "",
      gender: "",
      price: "",
      university: "",
      address: "",
    });
    setCoverImage(null);
    setOtherFiles([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = "http://localhost:5000/api/BoardingHouse/upload";
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append("coverImage", coverImage);
    otherFiles.forEach((file) => {
      formDataToSend.append("otherFiles", file);
    });

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found, please login first");
        return;
      }
      const response = await axios.post(url, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Boarding house created successfully!");
      resetForm();
    } catch (error) {
      toast.error("Error posting form: " + error.response.data.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
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
            <div
              style={{
                position: "relative",
                width: "20%",
                marginBottom: "10px",
              }}
            >
              <img src={coverImageUrl} alt="Cover" style={{ width: "100%" }} />
              <span
                onClick={removeImage}
                className="p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
              >
                <IoCloseSharp />
              </span>
            </div>
          )}
          <input
            type="file"
            name="coverImage"
            onChange={handleImageChange}
            accept="image/*"
            required
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {otherFilesUrls.map((file, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  width: "20%",
                  marginBottom: "10px",
                }}
              >
                {file.type.startsWith("video") ? (
                  <video controls style={{ width: "100%" }}>
                    <source src={file.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={file.url}
                    alt="Preview"
                    style={{ width: "100%", height: "auto" }}
                  />
                )}
                <span
                  onClick={() => removeFile(index)}
                  className="p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
                >
                  <IoCloseSharp />
                </span>
              </div>
            ))}
          </div>
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

export default AddBoarding;
