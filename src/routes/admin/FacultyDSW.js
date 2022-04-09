import express from "express";
import argon2 from 'argon2';
import DSW from "../../models/DSW.js";
import FacultyCoordinator from "../../models/FacultyCoordinator.js";
import { validateFC, validateDSW } from '../../utils/validate.js';
import { verifyAdmin } from '../../middlewares/checkAuth.js';

const router = express.Router();
router.use(verifyAdmin);

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
		const faculty = new FacultyCoordinator({
			name: req.body.name,
			email: req.body.email,
			password: await argon2.hash(req.body.password)
		});
		faculty.save()
			.then(faculty => {
				return res.json({ success: true, facultyId: faculty._id });
			})
			.catch(err => {
				return res.status(500).json({ success: false });
			});
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
		dsw.save()
		.then(dsw => {
			return res.json({ success: true, dswId: dsw._id });
		})
		.catch(err => {
			return res.status(500).json({ success: false });
		});
	}
});

export default router;
