import argon2 from "argon2";
import Faculty from "../../models/Faculty.js";
import express from "express";
import { validateFaculty } from "../../utils/validate.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const errors = [];
  if (
    validateFaculty({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
  ) {
    validateError.details.forEach((error) => {
      errors.push({
        key: error.path[0],
        message: error.message,
      });
    });
    return res.json({ success: false, errors });
  }
  const emailExists = await Faculty.findOne({
    email: req.body.email,
  });
  if (emailExists) {
    errors.push({
      key: "email",
      message: "Email already exists",
    });
		return res.json({ success: false, errors });
  }
  else {
    const faculty = new Faculty({
      name: req.body.name,
      email: req.body.email,
      password: await argon2.hash(req.body.password),
    });
    await faculty.save();
    return res.json({ success: true });
  }
});

/* router.post("/signin", async (req, res) => {
	faculty.findOne({  email: req.body.email })
	.exec()
	.then(async (faculty) => {
		console.log("activate")
		if(!faculty) {
			res.status(401).json({ success: false, message: "Email not found"});
		}
		const passValid = await argon2.verify(faculty.password, req.body.password);
		if(!passValid) {
			res.status(401).json({ success: false, message: "Password is incorrect"});
		}
		req.session.userId = faculty._id;
		res.json({ success: true });
		next();
	})
	.catch(err => {
		console.log(err);
		return res.status(500).json({ success: false, message: "Something went wrong" });
	});
}); */

router.post("/signin", async (req, res) => {
  const faculty = await Faculty.findOne({ email: req.body.email });
  if (!faculty) {
    return res.status(401).json({ success: false, message: "Email not found" });
  }
  const passValid = await argon2.verify(faculty.password, req.body.password);
  if (!passValid) {
    return res
      .status(401)
      .json({ success: false, message: "Password is incorrect" });
  } else {
    req.session.userId = faculty._id;
    return res.send({
      success: true,
      user: { name: faculty.name, email: faculty.email },
    });
  }
});

export default router;
