import argon2 from 'argon2';
import FC from '../models/FacultyCoordinator';
import jwt from 'jsonwebtoken';
import express from 'express';
import { secret } from '../middlewares/authjwt.js';

const router = express.Router();

router.post("/signin", async (req, res) => {
	FC.findOne({  email: req.body.email })
	.exec()
	.then(async (FC) => {
		if(!FC) {
			return res.status(401).json({ success: false, message: "Email not found"});
		}
		const passValid = await argon2.verify(FC.password, req.body.password);
		if(!passValid) {
			return res.status(401).json({ success: false, message: "Password is incorrect"});
		}
		const token = jwt.sign({ id: FC._id }, secret, {
			expiresIn: 60 * 60 * 24
		});
		return res.json({ token: token, success: true });
	})
	.catch(err => {
		console.log(err);
		return res.status(500).json({ success: false, message: "Something went wrong" });
	});
});

export default router;
