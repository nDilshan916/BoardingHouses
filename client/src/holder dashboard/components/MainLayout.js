import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Heder"; // Corrected typo from 'Heder' to 'Header'

const MainLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar style={{ width: "250px", flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet /> {/* Where nested routes will render */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
