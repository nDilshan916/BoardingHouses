const mongoose = require("mongoose");

const holderProfileSchema = new mongoose.Schema(
  {
    holderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    profilePhoto: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const HolderProfile = mongoose.model("holderProfile", holderProfileSchema);
module.exports = HolderProfile;
