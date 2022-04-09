import argon2 from "argon2";
import express from "express";
import User from "../../models/User.js";
import { validateUser, validatePassword } from "../../utils/validate.js";
import { verifyUser } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const errors = [];
  const validateError = validateUser({
    regNo: req.body.regNo,
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
  const regExists = await User.findOne({ regNo: req.body.regNo });
  if (regExists) {
    errors.push({
      key: "regNo",
      message: "Registration already exists",
    });
  }
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    errors.push({
      key: "email",
      message: "Email already exists",
    });
  }
  if (regExists || emailExists) return res.json({ success: false, errors });
  else {
    const User = new User({
      regNo: req.body.regNo,
      name: req.body.name,
      email: req.body.email,
      password: await argon2.hash(req.body.password),
    });
    User.save()
      .then((user) => {
        return res.json({ success: true, userId: user._id });
      })
      .catch((err) => {
        return res.status(500).json({ success: false });
      });
  }
});

router.post("/signin", async (req, res) => {
  const User = await User.findOne({ regNo: req.body.regNo });
  if (!User) {
    return res.status(401).json({ success: false, message: "User not found" });
  }
  const passValid = await argon2.verify(User.password, req.body.password);
  if (!passValid) {
    return res
      .status(401)
      .json({ success: false, message: "Password is incorrect" });
  } else {
    req.session.userId = User._id;
    return res.send({
      success: true,
      user: { regNo: User.regNo, name: User.name, email: User.email },
    });
  }
});

router.post("/resetpassword", verifyUser, async (req, res) => {
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
  User.findByIdAndUpdate(req.session.userId, {
    password: await argon2.hash(req.body.password),
  }).then((User) => {
    if (!User) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
    return res.json({ success: true });
  });
});

export default router;
