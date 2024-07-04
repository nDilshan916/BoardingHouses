import React from "react";
import Header from "../components/Header/Header.js";
import University from "../components/Universities/Uni.js";
import Hero from "../components/Hero/Hero";
import Value from "../components/Value/Value.jsx";
import Contact from "../components/UniCard/Contact.js";
import Footer from "../components/Footer/Footer.js";

function HomePage() {
  return (
    <div>
      <div className="relative overflow-x-hidden bg-black">
        <Header />
        <div className="absolute w-80 h-80 bg-white bg-opacity-50 blur-[100px] rounded-full" />
        <Hero />
      </div>
      <University />
      <Value />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
