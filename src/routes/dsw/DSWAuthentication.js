import argon2 from "argon2";
import DSW from "../../models/DSW.js";
import express from "express";
import { validatePassword } from "../../utils/validate.js";
import { verifyDSW } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/signin", async (req, res) => {
  DSW.findOne({ email: req.body.email })
    .exec()
    .then(async (DSW) => {
      if (!DSW) {
        return res
          .status(401)
          .json({ success: false, message: "Email not found" });
      }
      const passValid = await argon2.verify(DSW.password, req.body.password);
      if (!passValid) {
        return res
          .status(401)
          .json({ success: false, message: "Password is incorrect" });
      }
      req.session.userId = DSW._id;
      return res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    });
});

router.post("/resetpassword", verifyDSW, async (req, res) => {
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
  DSW.findByIdAndUpdate(req.session.userId, {
    password: await argon2.hash(req.body.password),
  }).then((dsw) => {
    if (!dsw) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    }
    return res.json({ success: true });
  });
});

export default router;
