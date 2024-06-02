const router = require("express").Router();
const HolderProfile = require("../models/holderProfile");
const cloudinary = require("../utils/cloudinary");
const Formidable = require("formidable");

router.post("/profile", async (req, res) => {
  const form = new Formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the form: ", err);
      return res.status(500).send("Error parsing the form.");
    }

    const { holderId, contactNumber, address } = fields;
    if (!files.profilePhoto) {
      return res.status(400).send("Profile photo is required.");
    }

    try {
      const profilePhotoResults = await cloudinary.uploader.upload(
        files.profilePhoto.path,
        {
          folder: "holderProfilePhoto",
        }
      );

      const profilePhotoUrl = profilePhotoResults.url;

      const newHolderProfile = new HolderProfile({
        holderId,
        contactNumber,
        profilePhoto: profilePhotoUrl,
        address,
      });

      await newHolderProfile.save();
      return res.status(201).json(newHolderProfile);
    } catch (error) {
      console.error("Error creating holder profile: ", error);
      res.status(500).send(error.message);
    }
  });
});

router.put("/profile/:id", async (req, res) => {
  const form = new Formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the form: ", err);
      return res.status(500).send("Error parsing the form.");
    }

    const profileId = req.params.id;
    try {
      const holderProfile = await HolderProfile.findById(profileId);
      if (!holderProfile) {
        return res.status(404).send("Profile not found.");
      }

      holderProfile.contactNumber =
        fields.contactNumber || holderProfile.contactNumber;
      holderProfile.address = fields.address || holderProfile.address;

      if (files.profilePhoto) {
        const profilePhotoResults = await cloudinary.uploader.upload(
          files.profilePhoto.path,
          {
            folder: "holderProfilePhoto",
          }
        );
        holderProfile.profilePhoto = profilePhotoResults.url;
      }

      await holderProfile.save();
      res.json(holderProfile);
    } catch (error) {
      console.error("Error updating holder profile: ", error);
      res.status(500).send(error.message);
    }
  });
});

module.exports = router;
