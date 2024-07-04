import React from "react";
import { AiFillStar } from "react-icons/ai";
import { CiStar } from "react-icons/ci";

const Ratings = ({ setRating }) => {
  const ratings = [
    {
      stars: 5,
      component: [
        <AiFillStar />,
        <AiFillStar />,
        <AiFillStar />,
        <AiFillStar />,
        <AiFillStar />,
      ],
    },
    {
      stars: 4,
      component: [
        <AiFillStar />,
        <AiFillStar />,
        <AiFillStar />,
        <AiFillStar />,
        <CiStar />,
      ],
    },
    {
      stars: 3,
      component: [
        <AiFillStar />,
        <AiFillStar />,
        <AiFillStar />,
        <CiStar />,
        <CiStar />,
      ],
    },
    {
      stars: 2,
      component: [
        <AiFillStar />,
        <AiFillStar />,
        <CiStar />,
        <CiStar />,
        <CiStar />,
      ],
    },
    {
      stars: 1,
      component: [
        <AiFillStar />,
        <CiStar />,
        <CiStar />,
        <CiStar />,
        <CiStar />,
      ],
    },
    {
      stars: 0,
      component: [<CiStar />, <CiStar />, <CiStar />, <CiStar />, <CiStar />],
    },
  ];

  return (
    <div>
      <div className="py-3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-3 text-[#1f3e72]">Rating</h2>
        <div className="flex flex-col gap-3">
          {ratings.map((rating) => (
            <div
              key={rating.stars}
              onClick={() => setRating(rating.stars)}
              className="text-yellow-500 flex justify-start items-start gap-2 text-xl cursor-pointer"
            >
              {rating.component.map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ratings;
