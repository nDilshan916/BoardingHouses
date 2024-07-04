import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBoarding = () => {
  const [boardings, setBoardings] = useState([]);
  // const [Available,setAvailable] =  useState([]);
  // const { id } = useParams();

  // Fetch data from the backend
  useEffect(() => {
    const fetchBoardings = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from storage

        if (!token) {
          console.error("No token found, please login first");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/BoardingHouse",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBoardings(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchBoardings();
  }, []); // Empty dependency array means this effect runs only once after the initial render

  const updateAvailability = async (id, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/BoardingHouse/update-availability/${id}`,
        { availability: newStatus }
      );
      setBoardings(
        boardings.map((boarding) =>
          boarding._id === id
            ? { ...boarding, availability: newStatus }
            : boarding
        )
      );
      toast.success("Availability Updated Successfully");
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  const deleteBoarding = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/BoardingHouse/${id}`
      );
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <ToastContainer />
      <div className="w-full p-4  bg-white rounded-md">
        <div className="relative overflow-x-auto mt-5">
          <table className="w-full text-sm text-left text-black">
            <thead className="text-sm text-black uppercase border-b-2 border-blue-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  Image
                </th>
                <th scope="col" className="py-3 px-4">
                  Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Near University
                </th>

                <th scope="col" className="py-3 px-4">
                  Price
                </th>

                <th scope="col" className="py-3 px-4">
                  Availability
                </th>

                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {boardings.map((boarding, index) => (
                <tr key={index}>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    {index + 1}
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <img
                      className="w-[45px] h-[45px]"
                      src={boarding.coverImage}
                      alt=""
                    />
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{boarding?.name?.slice(0, 16)}...</span>
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{boarding.university}</span>
                  </td>

                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>Rs {boarding.price}</span>
                  </td>

                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <select
                      onChange={(e) =>
                        updateAvailability(boarding._id, e.target.value)
                      }
                      value={boarding.availability}
                      className="px-2 py-1 focus:border-indigo-500 outline-none bg-white border border-slate-700 rounded-md text-black"
                    >
                      <option value="Available">Available</option>
                      <option value="Not available">Not Available</option>
                    </select>
                  </td>

                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        to={`/holder-dashboard/update-boarding/${boarding._id}`}
                        className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        className="p-[6px] bg-red-600 rounded hover:shadow-md hover:shadow-red-600/50"
                        onClick={() => deleteBoarding(boarding._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
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

export default EditBoarding;
