import React from "react";

const GenderFilter = ({ gender, setGender }) => {
  const handleGenderChange = (selectedGender) => {
    setGender((prevGender) =>
      prevGender === selectedGender ? "both" : selectedGender
    );
  };

  return (
    <div>
      <div className="py-3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-3 text-[#1f3e72]">Gender</h2>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="gender"
              value="male"
              checked={gender === "male"}
              onChange={() => handleGenderChange("male")}
              className="form-checkbox"
            />
            Male
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="gender"
              value="female"
              checked={gender === "female"}
              onChange={() => handleGenderChange("female")}
              className="form-checkbox"
            />
            Female
          </label>
        </div>
      </div>
    </div>
  );
};

export default GenderFilter;
