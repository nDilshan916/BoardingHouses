import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import {
  BiLogOutCircle,
  BiMessageSquareDetail,
  BiEdit,
  BiHomeCircle,
  BiArrowToRight,
} from "react-icons/bi";
import { MdEventAvailable } from "react-icons/md";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [userInfo, setUser] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

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

  return (
    <div className="w-70 h-full bg-gray-50 p-4 shadow">
      <ul className="list-none m-0 p-0">
        <li>
          <button
            onClick={() => navigateTo("/holder-dashboard/add-boarding")}
            className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors w-full text-left ${isActive("/holder-dashboard/add-boarding")}`}
          >
            <BiHomeCircle size={24} />
            <span>Add Boarding House</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigateTo("/holder-dashboard/edit-boarding")}
            className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors w-full text-left ${isActive("/holder-dashboard/edit-boarding")}`}
          >
            <BiEdit size={24} />
            <span>Edit & Update Boarding House</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigateTo("/holder-dashboard/request")}
            className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors w-full text-left ${isActive("/holder-dashboard/request")}`}
          >
            <BiArrowToRight size={24} />
            <span>Request</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigateTo("/holder-dashboard/visit")}
            className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors w-full text-left ${isActive("/holder-dashboard/visit")}`}
          >
            <MdEventAvailable size={24} />
            <span>Visit Appointments</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigateTo(`/holder-dashboard/chat/${user._id}`)}
            className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors w-full text-left ${isActive(`/holder-dashboard/chat/${user._id}`)}`}
          >
            <BiMessageSquareDetail size={24} />
            <span>Chat</span>
          </button>
        </li>
        <li>
          {userInfo && (
            <button
              onClick={() =>
                navigateTo(`/holder-dashboard/profile/${userInfo._id}`)
              }
              className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors w-full text-left ${isActive(`/holder-dashboard/profile/${userInfo._id}`)}`}
            >
              <CgProfile size={24} />
              <span>Profile</span>
            </button>
          )}
        </li>

        <li>
          <button
            onClick={handleLogout}
            className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors w-full text-left ${isActive("/login")}`}
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
