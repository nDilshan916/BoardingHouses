import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState(null);
  const params = useParams();
  const _id = params ? params._id : null;

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     if (_id) {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:5000/api/auth/${_id}`
  //         );
  //         setUsers(response.data);
  //         console.log(response.data);
  //       } catch (error) {
  //         console.error("Error fetching user:", error);
  //       }
  //     }
  //   };
  //   fetchUsers();
  // }, [_id]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-black shadow-md p-4 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold text-white no-underline">
          Boarding Management System
        </Link>
      </div>
      <nav>
        {user ? (
          <div className="flex items-center space-x-4">
            <Link
              to={`/user-dashboard`}
              className="text-white hover:text-red-600 transition-colors duration-200"
            >
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to="/signup"
              className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              Signup
            </Link>
            <Link
              to="/login"
              className="text-gray-800 hover:text-blue-600 transition-colors duration-200"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
