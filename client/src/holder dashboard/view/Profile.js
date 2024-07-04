import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    profilePictureUrl: "",
    profilePictureFile: null,
    previewUrl: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`
        );
        if (response.data) {
          const {
            firstName,
            lastName,
            email,
            address,
            contactNumber,
            profilePictureUrl,
          } = response.data;
          //updating the form data state with fetched user data
          setFormData({
            firstName,
            lastName,
            email,
            address,
            contactNumber,
            profilePictureUrl,
            profilePictureFile: null,
            previewUrl: profilePictureUrl,
          });
        } else {
          toast.info("No user data found for this ID");
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

  const handleChange = (e) => {
    if (e.target.name === "profilePictureFile") {
      const file = e.target.files[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        profilePictureFile: file,
        previewUrl: URL.createObjectURL(file), // this url is used to preview the image before update the image
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const updateHolderProfile = async () => {
    try {
      const userData = new FormData();
      userData.append("firstName", formData.firstName);
      userData.append("lastName", formData.lastName);
      userData.append("email", formData.email);
      userData.append("address", formData.address);
      userData.append("contactNumber", formData.contactNumber);
      if (formData.profilePictureFile) {
        userData.append("profilePicture", formData.profilePictureFile);
      } else if (formData.profilePictureUrl) {
        userData.append("profilePictureUrl", formData.profilePictureUrl);
      }

      const response = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        userData
      );

      if (response.data) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          profilePictureUrl: response.data.profilePictureUrl, // Update the profile picture URL
          previewUrl: response.data.profilePictureUrl, // Update the preview URL
        }));
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };

  return (
    <div className="max-w-2xl ml-10 mt-10 p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <div className="flex justify-center mb-4">
        {formData.previewUrl ? (
          <img
            src={formData.previewUrl}
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover"
          />
        ) : (
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="w-36 h-36 rounded-full object-cover"
          />
        )}
      </div>
      <div className="flex justify-center mb-4">
        <label className="bg-blue-gradient py-2 px-4 text-white rounded-md cursor-pointer">
          Select Profile Picture
          <input
            type="file"
            name="profilePictureFile"
            onChange={handleChange}
            accept="image/*"
            className="hidden"
          />
        </label>
      </div>
      <div>
        <form className="space-y-4">
          <div className="grid grid-cols-2">
            <div className="pr-4">
              <label
                htmlFor="FirstName"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="pr-4">
              <label
                htmlFor="LastName"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          {/* <div>
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div> */}
          <div>
            <label
              htmlFor="contactNumber"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              type="number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-black focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={updateHolderProfile}
              className="w-auto bg-blue-gradient px-4 py-2 rounded-lg  text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600 "
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
