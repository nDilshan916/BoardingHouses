import React from "react";
import { Link } from "react-router-dom";
import universities from "../data/UniData";
import Header from "../components/Header";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
          {universities.map((uni) => (
            <Link
              to={`/university/${uni.id}`}
              key={uni.id}
              className="no-underline text-gray-900"
            >
              <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 p-4 rounded-lg text-center flex flex-col h-full">
                <img
                  src={uni.logo}
                  alt={uni.name}
                  className="w-20 h-20 mx-auto object-contain rounded-full"
                />
                <h2 className="mt-2 text-lg font-bold">{uni.name}</h2>
                {/* Ensure the space below the name is consistent */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
