import React from "react";
import Header from "../../components/Header/Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-auto p-24 ">
        <Sidebar className="w-10  bg-white shadow-lg box-border border-black border-4" />
        <div className="flex-auto bg-white shadow-lg rounded-lg ">
          <Outlet /> {/* Where nested routes will render */}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
