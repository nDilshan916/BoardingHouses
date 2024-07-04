import axios from "axios";
import React, { useEffect, useState } from "react";

const UserVisits = () => {
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
          "http://localhost:5000/api/visit/user",
          config
        );
        setVisits(response.data);
      } catch (error) {
        console.log("error fetching holder visit appointments:", error);
      }
    };
    fetchVisits();
  }, []);

  return (
    <div className="px-2 lg:px-7 pt-5">
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
                <th scope="col" className="py-3 pl-5">
                  Image
                </th>
                <th scope="col" className="py-3">
                  Holder Contact Number
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
                    <span>{visit.boardingHouse.name}</span>
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <img
                      className="w-[50px] h-[50px]"
                      src={visit.boardingHouse.coverImage}
                      alt=""
                    />
                  </td>
                  <td className="py-1 px-4 font-medium whitespace-nowrap">
                    <span>
                      {visit.boardingHouse?.user?.contactNumber || "N/A"}
                    </span>
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
                      <span className="text-black">Pending</span>
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

export default UserVisits;
