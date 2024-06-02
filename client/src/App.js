import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import HomePage from "./pages/Home";
import UniversityPage from "./pages/UniversityPage";
import BoardingHouseDetails from "./pages/BoardingHouseDetails";
import ReviewsPage from "./pages/ReviewsPage";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import UserDashboard from "./pages/user dashboard/UserDashboard";
import UserProfile from "./pages/user dashboard/UserProfile";
import MainLayout from "./holder dashboard/components/MainLayout";
import AddBoarding from "./holder dashboard/view/AddBoarding";
import EditBoarding from "./holder dashboard/view/EditBoarding";
import UpdateBoarding from "./holder dashboard/view/UpdateBoarding";
import Chat from "./holder dashboard/view/Chat";
import Profile from "./holder dashboard/view/Profile";
import UserReview from "./pages/user dashboard/UserReview.jsx"; // Import the UserReview component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/university/:id" element={<UniversityPage />} />
        <Route path="/boarding/:_id" element={<BoardingHouseDetails />} />
        <Route path="/reviews/:_id" element={<ReviewsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route path="user-profile/:id" element={<UserProfile />} />
          <Route path="user-review/:boardingHouseId" element={<UserReview />} /> {/* New route for UserReview */}
        </Route>
        <Route path="/holder-dashboard" element={<MainLayout />}>
          <Route path="add-boarding" element={<AddBoarding />} />
          <Route path="edit-boarding" element={<EditBoarding />} />
          <Route path="update-boarding/:id" element={<UpdateBoarding />} />
          <Route path="chat" element={<Chat />} />
          <Route path="profile/:id" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
