import express from "express";
import argon2 from 'argon2';
import DSW from "../../models/DSW.js";
import FacultyCoordinator from "../../models/FacultyCoordinator.js";
import Admin from "../../models/Admin.js"
import { validateAdmin, validateFC, validatePassword } from '../../utils/validate.js';
import { verifyAdmin } from '../../middlewares/checkAuth.js';

const router = express.Router();

router.post("/facultyregister", async (req, res) => {
	const errors = [];
	const validateError = validateFC({ name: req.body.name, email: req.body.email, password: req.body.password });
	if (validateError) {
		validateError.details.forEach((error) => {
			errors.push({
				key: error.path[0],
				message: error.message
			});
		});
		return res.json(errors);
	}
	const emailExists = await FacultyCoordinator.findOne({ email: req.body.email });
	if (emailExists) {
		errors.push({
			key: "email",
			message: "Email already exists"
		});
	}
	if (emailExists) return res.json({ errors });
	else {
		const fc = new FacultyCoordinator({
			name: req.body.name,
			email: req.body.email,
			password: await argon2.hash(req.body.password)
		});
		await fc.save();
		return res.json({ success: true });
	}
});

router.post("/dswregister", async (req, res) => {
	const errors = [];
	const validateError = validateDSW({ name: req.body.name, email: req.body.email, password: req.body.password });
	if (validateError) {
		validateError.details.forEach((error) => {
			errors.push({
				key: error.path[0],
				message: error.message
			});
		});
		return res.json(errors);
	}
	const emailExists = await DSW.findOne({ email: req.body.email });
	if (emailExists) {
		errors.push({
			key: "email",
			message: "Email already exists"
		});
	}
	if (emailExists) return res.json({ errors });
	else {
		const dsw = new DSW({
			name: req.body.name,
			email: req.body.email,
			password: await argon2.hash(req.body.password)
		});
		await dsw.save();
		return res.json({ success: true });
	}
});

router.post("/signin", async (req, res) => {
	const admin = await Admin.findOne({ email: req.body.email });
	if(!admin) {
		return res.status(401).json({ success: false, message: "Email not found"});
	}
	const passValid = await argon2.verify(admin.password, req.body.password);
	if(!passValid) {
		return res.status(401).json({ success: false, message: "Password is incorrect"});
	}
	else {
		req.session.userId = admin._id;
		return res.send({ success: true, user: { email: admin.email } });
	}
});

/* router.post("/resetpassword", verifyAdmin, async (req, res) => {
	const errors = [];
	const validateError = validatePassword({ password: req.body.password });
	if (validateError) {
		validateError.details.forEach((error) => {
			errors.push({
				key: error.path[0],
				message: error.message
			});
		});
		return res.json({ success: false, errors });
	}
	Admin.findByIdAndUpdate(req.session.userId, { password: await argon2.hash(req.body.password) })
	.then((admin => {
		if(!admin) {
			return res.status(500).json({ success: false, message: "Something went wrong"});
		}
		return res.json({ success: true });
	}));
}); */

export default router;
