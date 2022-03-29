import AsyncErrorHandler from '../middlewares/ErrorHandlers/AsyncErrorHandler.js';
import argon2 from 'argon2';
import Club from '../models/Club.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import { validateClub } from '../utils/validate.js';
import { secret, verifyToken } from '../middlewares/authjwt.js';

const router = express.Router();

router.post("/register",  AsyncErrorHandler(async (req, res) => {
	const errors = [];
	if (validateClub({ name: req.body.name, email: req.body.email, password: req.body.password })) {
		validateError.details.forEach((error) => {
			errors.push({
				key: error.path[0],
				message: error.message
			});
		});
		return res.json(errors);
	}
	const nameExists = await Club.findOne({ name: req.body.name });
	if (nameExists) {
		errors.push({
			key: "name",
			message: "Club already exists"
		});
	}
	const emailExists = await Club.findOne({ email: req.body.email });
	if (emailExists) {
		errors.push({
			key: "email",
			message: "Email already exists"
		});
	}
	if (nameExists || emailExists) return res.json({ errors });
	const club = new Club({
		name: req.body.name,
		email: req.body.email,
		password: await argon2.hash(req.body.password)
	});
	await club.save();
	return res.json({ success: true });
}));

router.post("/signin", AsyncErrorHandler(async (req, res) => {
	Club.findOne({  email: req.body.email })
	.exec()
	.then(async (club) => {
		if(!club) {
			return res.status(401).json({ success: false, message: "Email not found"});
		}
		const passValid = await argon2.verify(club.password, req.body.password);
		if(!passValid) {
			return res.status(401).json({ success: false, message: "Password is incorrect"});
		}
		const token = jwt.sign({ id: club._id }, secret, {
			expiresIn: 60 * 60 * 24
		});
		return res.json({ token: token, success: true });
	})
	.catch(err => {
		console.log(err);
		return res.status(500).json({ success: false, message: "Something went wrong" });
	});
}));

router.get("/checkAuth", verifyToken, (req, res) => {
	return res.send({ success: true });
});

export default router;
