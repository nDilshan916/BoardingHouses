import React, { useState } from "react";
import { BiMenuAltRight } from "react-icons/bi";
import { IoIosLogIn } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import useHeaderColor from "../../hooks/useHeaderColor.js";
import { HiUserCircle } from "react-icons/hi";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleUserProfile = (user) => {
    navigate(`/user-dashboard/user-profile/${user._id}`);
  };

  return (
    <section
      className="h-wrapper sticky top-0 z-50"
      style={{ background: pathname !== "/" ? "black" : headerColor }}
    >
      <div className="flex justify-between items-center w-full px-4 py-2">
        {/* logo */}
        <div>
          <Link to="/" className="text-xl font-bold text-white no-underline">
            Boarding Management System
          </Link>
        </div>

        {/* menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/"
            className={`p-2 ${
              pathname === "/" ? "text-white" : "text-gray-400 hover:text-white"
            } no-underline`}
          >
            Home
          </Link>
          <Link
            to="/allboardings"
            className={`p-2 ${
              pathname === "/allboardings"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            } no-underline`}
          >
            Boardings
          </Link>
          <Link
            to="/faq"
            className={`p-2 ${
              pathname === "/faq"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            } no-underline`}
          >
            FAQ
          </Link>
          <Link
            to="/about"
            className={`p-2 ${
              pathname === "/about"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            } no-underline`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`p-2 ${
              pathname === "/contact"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            } no-underline`}
          >
            Contact
          </Link>
          {user ? (
            <button
              className="flex items-center p-2 text-white no-underline"
              onClick={() => handleUserProfile(user)}
            >
              <HiUserCircle size={24} className="pr-1" />
              {user.name}
            </button>
          ) : (
            <button
              className="button flex items-center text-white font-bold"
              onClick={handleLogout}
            >
              Login
            </button>
          )}
        </div>

        {/* for medium and small screens */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} className="text-white" />
        </div>
      </div>

      {/* mobile menu */}
      {menuOpened && (
        <div className="md:hidden bg-black text-white p-4 absolute w-full">
          <Link
            to="/"
            className="block py-2 no-underline"
            onClick={() => setMenuOpened(false)}
          >
            Home
          </Link>
          <Link
            to="/boardings"
            className="block py-2 no-underline"
            onClick={() => setMenuOpened(false)}
          >
            Boardings
          </Link>
          <Link
            to="/faq"
            className="block py-2 no-underline"
            onClick={() => setMenuOpened(false)}
          >
            FAQ
          </Link>
          <Link
            to="/about"
            className="block py-2 no-underline"
            onClick={() => setMenuOpened(false)}
          >
            About
          </Link>
          <Link
            to="/contact"
            className="block py-2 no-underline"
            onClick={() => setMenuOpened(false)}
          >
            Contact
          </Link>
          {user ? (
            <button
              className="block py-2 no-underline"
              onClick={() => {
                handleUserProfile(user);
                setMenuOpened(false);
              }}
            >
              {user.name}
            </button>
          ) : (
            <button
              className="button flex items-center text-white font-bold w-full text-left no-underline"
              onClick={() => {
                handleLogout();
                setMenuOpened(false);
              }}
            >
              Login
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Header;
