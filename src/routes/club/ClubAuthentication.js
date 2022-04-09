import argon2 from "argon2";
import express from "express";
import Club from "../../models/Club.js";
import { validateClub, validatePassword } from "../../utils/validate.js";
import { verifyClub } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const errors = [];
  const validateError = validateClub({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  if (validateError) {
    validateError.details.forEach((error) => {
      errors.push({
        key: error.path[0],
        message: error.message,
      });
    });
    return res.json({ success: false, errors });
  }
  const nameExists = await Club.findOne({ name: req.body.name });
  if (nameExists) {
    errors.push({
      key: "name",
      message: "Club already exists",
    });
  }
  const emailExists = await Club.findOne({ email: req.body.email });
  if (emailExists) {
    errors.push({
      key: "email",
      message: "Email already exists",
    });
  }
  if (nameExists || emailExists) return res.json({ success: false, errors });
  else {
    const club = new Club({
      name: req.body.name,
      email: req.body.email,
      password: await argon2.hash(req.body.password),
    });
    club
      .save()
      .then((club) => {
        return res.json({ success: true, clubId: club._id });
      })
      .catch((err) => {
        return res.status(500).json({ success: false });
      });
  }
});

router.post("/signin", async (req, res) => {
  const club = await Club.findOne({ email: req.body.email });
  if (!club) {
    return res.status(401).json({ success: false, message: "Email not found" });
  }
  const passValid = await argon2.verify(club.password, req.body.password);
  if (!passValid) {
    return res
      .status(401)
      .json({ success: false, message: "Password is incorrect" });
  } else {
    req.session.userId = club._id;
    return res.send({
      success: true,
      user: { name: club.name, email: club.email },
    });
  }
});

router.post("/resetpassword", verifyClub, async (req, res) => {
  const errors = [];
  const validateError = validatePassword({ password: req.body.password });
  if (validateError) {
    validateError.details.forEach((error) => {
      errors.push({
        key: error.path[0],
        message: error.message,
      });
    });
    return res.json({ success: false, errors });
  }
  Club.findByIdAndUpdate(req.session.userId, {
    password: await argon2.hash(req.body.password),
  }).then((club) => {
    if (!club) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
    return res.json({ success: true });
  });
});

export default router;
