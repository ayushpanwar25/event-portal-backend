import argon2 from 'argon2';
import FacultyCoordinator from '../../models/FacultyCoordinator.js';
import express from 'express';
import { validateFC } from '../../utils/validate.js';

const router = express.Router();

router.post("/register", async (req, res) => {
	const errors = [];
	if (validateFC({ name: req.body.name, email: req.body.email, password: req.body.password })) {
		validateError.details.forEach((error) => {
			errors.push({
				key: error.path[0],
				message: error.message
			});
		});
		return res.json({ success:false, errors });
	}
	const emailExists = await FacultyCoordinator.findOne({ email: req.body.email });
	if (emailExists) {
		errors.push({
			key: "email",
			message: "Email already exists"
		});
	}
	if (emailExists) return res.json({ success: false, errors });
	else {
		const fc = new FC({
			name: req.body.name,
			email: req.body.email,
			password: await argon2.hash(req.body.password)
		});
		await fc.save();
		return res.json({ success: true });
	}
});

/* router.post("/signin", async (req, res) => {
	FC.findOne({  email: req.body.email })
	.exec()
	.then(async (FC) => {
		console.log("activate")
		if(!FC) {
			res.status(401).json({ success: false, message: "Email not found"});
		}
		const passValid = await argon2.verify(FC.password, req.body.password);
		if(!passValid) {
			res.status(401).json({ success: false, message: "Password is incorrect"});
		}
		req.session.userId = FC._id;
		res.json({ success: true });
		next();
	})
	.catch(err => {
		console.log(err);
		return res.status(500).json({ success: false, message: "Something went wrong" });
	});
}); */

router.post("/signin", async (req, res) => {
	const fc = await FacultyCoordinator.findOne({ email: req.body.email });
	if(!fc) {
		return res.status(401).json({ success: false, message: "Email not found"});
	}
	const passValid = await argon2.verify(fc.password, req.body.password);
	if(!passValid) {
		return res.status(401).json({ success: false, message: "Password is incorrect"});
	}
	else {
		req.session.userId = fc._id;
		return res.send({ success: true, user: { name: fc.name, email: fc.email } });
	}
});

export default router;
