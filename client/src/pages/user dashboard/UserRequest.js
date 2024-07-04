import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineRateReview } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserRequest = () => {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/request/user",
          config
        );
        setRequests(response.data);
      } catch (error) {
        console.log("Error fetching holder request", error);
      }
    };
    fetchRequests();
  }, []);

  const handleReviewClick = (request) => {
    if (request.status === "accept") {
      navigate(`/user-dashboard/user-review/${request.boardingHouse._id}`);
    }
    if (request.status === "reject") {
      toast.error("your request was rejected.");
    } else {
      toast.warning("Please wait until the holder accepts your request.");
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
                  Boarding House Name
                </th>
                <th scope="col" className="py-3">
                  Image
                </th>
                <th scope="col" className="py-3">
                  Contact Number
                </th>
                <th scope="col" className="py-3">
                  Price (Month)
                </th>
                <th scope="col" className="py-3">
                  Result
                </th>
                <th scope="col" className="py-3">
                  Review
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index}>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {request.boardingHouse.name}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <img
                      className="w-[50px] h-[50px]"
                      src={request.boardingHouse.coverImage}
                      alt=""
                    />
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {request.user.contactNumber}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    Rs {request.totalPrice}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    {request.status}
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <div className="flex justify-start items-center gap-4">
                      <button
                        onClick={() => handleReviewClick(request)}
                        className="p-[6px] border border-black rounded hover:shadow-lg hover:shadow-blue-200"
                      >
                        <MdOutlineRateReview size={20} />
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

export default UserRequest;
