import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VisitAppointments = () => {
  const [visits, setVisits] = useState([]);
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/visit/holder",
          config
        );
        setVisits(response.data);
      } catch (error) {
        console.log("error fetching holder visit appointments:", error);
      }
    };
    fetchVisits();
  }, []);

  const handleAccept = async (visitId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/visit/${visitId}`,
        { status: "accept" },
        config
      );
      setVisits((prevVisits) => {
        const updatedVisits = prevVisits.map((visit) =>
          visit._id === visitId ? { ...visit, status: "accept" } : visit
        );
        console.log("Updated visits:", updatedVisits);
        return updatedVisits;
      });
      toast.success("Accepted the request");
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  const handleReject = async (visitId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/visit/${visitId}`,
        { status: "reject" },
        config
      );
      setVisits((prevVisits) => {
        const updatedVisits = prevVisits.map((visit) =>
          visit._id === visitId ? { ...visit, status: "reject" } : visit
        );
        console.log("Updated visits:", updatedVisits);
        return updatedVisits;
      });
      toast.success("Rejected the request");
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <ToastContainer />
      <div className="w-full p-4 bg-white rounded-md">
        <div className="relative overflow-auto mt-5">
          <table className="w-full text-sm text-left text-black">
            <thead className="text-sm text-black uppercase border-b-2 border-blue-700">
              <tr>
                <th scope="col" className="py-3">
                  No
                </th>
                <th scope="col" className="py-3">
                  User Name
                </th>
                <th scope="col" className="py-3">
                  User Profile Pic
                </th>
                <th scope="col" className="py-3">
                  Contact Number
                </th>
                <th scope="col" className="py-3">
                  Appointed Date
                </th>
                <th scope="col" className="py-3">
                  Appointed Time
                </th>
                <th scope="col" className="py-3 pl-6">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit, index) => (
                <tr key={visit._id}>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>
                      {visit.user.firstName + " " + visit.user.lastName}
                    </span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <img
                      className="w-[50px] h-[50px]"
                      src={visit.user.profilePictureUrl}
                      alt=""
                    />
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{visit.user.contactNumber}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{visit.date}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>{visit.time}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {visit.status === "accept" ? (
                      <span className="text-green-700">Accepted</span>
                    ) : visit.status === "reject" ? (
                      <span className="text-red-700">Rejected</span>
                    ) : (
                      <>
                        <button className="">
                          <IoCheckmarkCircleOutline
                            size={24}
                            className="text-green-700 hover:bg-green-600 rounded-full "
                            onClick={() => handleAccept(visit._id)}
                          />
                        </button>
                        <button
                          className="ml-4 text-red-500 hover:bg-red-400 hover:text-red-900 rounded-full"
                          onClick={() => handleReject(visit._id)}
                        >
                          <IoCloseCircleOutline size={24} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitAppointments;
