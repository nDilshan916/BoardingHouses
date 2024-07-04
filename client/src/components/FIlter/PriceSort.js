import React from "react";

const PriceSort = ({ sortOrder, setSortOrder }) => {
  return (
    <div>
      <div className="py-3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-3 text-[#1f3e72]">
          Sort by Price
        </h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="priceSort"
              value="lowToHigh"
              checked={sortOrder === "lowToHigh"}
              onChange={() => setSortOrder("lowToHigh")}
              className="form-radio"
            />
            Low to High
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="priceSort"
              value="highToLow"
              checked={sortOrder === "highToLow"}
              onChange={() => setSortOrder("highToLow")}
              className="form-radio"
            />
            High to Low
          </label>
        </div>
      </div>
    </div>
  );
};

export default PriceSort;
