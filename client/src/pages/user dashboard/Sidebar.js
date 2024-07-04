import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { BiHome, BiLogOutCircle } from "react-icons/bi";
import { SlCalender } from "react-icons/sl";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [userInfo, setUser] = useState(null);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const navigateTo = (path) => {
    setActivePath(path);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setActivePath("/login");
    navigate("/login");
  };

  const isActive = (path) => {
    return activePath === path ? "bg-gray-300 font-bold" : "";
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User info from local storage:", user); // Log user info
        if (!user || !user.email) {
          throw new Error("User email is missing in local storage");
        }
        const userEmail = user.email;
        console.log("Fetching user data for email:", userEmail); // Log user email
        const response = await axios.get(
          `http://localhost:5000/api/users?email=${userEmail}`
        );
        const users = response.data;
        const currentUser = users.find((u) => u.email === userEmail);
        if (!currentUser) {
          throw new Error("User not found");
        }
        setUser(currentUser);
        console.log("Fetched user data:", currentUser); // Log fetched user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-70 h-full bg-blue-gradient p-4 shadow">
      <ul className="list-none m-0 p-0">
        <li>
          <button
            onClick={() =>
              navigateTo(`/user-dashboard/user-profile/${userInfo._id}`)
            }
            className={`flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-gray-200 transition-colors w-full text-left ${isActive(`/user-dashboard/user-profile/${userInfo._id}`)}`}
          >
            <CgProfile size={24} />
            <span>Profile</span>
          </button>
        </li>
        {/* <li>
          <button
            onClick={() =>
              navigateTo(`/user-dashboard/user-review/:boardingHouseId`)
            }
            className={`flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-gray-200 transition-colors w-full text-left ${isActive(`/user-dashboard/user-review/:boardingHouseId`)}`}
          >
            <MdOutlineRateReview size={24} />
            <span>Review</span>
          </button>
        </li> */}
        <li>
          <button
            onClick={() => navigateTo(`/user-dashboard/user-request`)}
            className={`flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-gray-200 transition-colors w-full text-left ${isActive(`/user-dashboard/user-request`)}`}
          >
            <BiHome size={24} />
            <span>Your Boarding House</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigateTo(`/user-dashboard/user-visit`)}
            className={`flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-gray-200 transition-colors w-full text-left ${isActive(`/user-dashboard/user-visit`)}`}
          >
            <SlCalender size={24} />
            <span>Visit Appointment</span>
          </button>
        </li>

        <li>
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-gray-200 transition-colors w-full text-left ${isActive("/login")}`}
          >
            <BiLogOutCircle size={24} />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
