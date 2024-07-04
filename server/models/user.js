const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "holder"], default: "user" }, // Add role field
  address: { type: String }, // Add address field
  contactNumber: { type: Number }, // Add contactNumber field
  profilePictureUrl: { type: String },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    role: Joi.string().valid("user", "holder").label("Role"), // Validate the role
    address: Joi.string().label("Address"), // Validate the address
    contactNumber: Joi.number().label("Contact Number"), // Validate the contact number
  });
  return schema.validate(data);
};

module.exports = { User, validate };
