//import jwt from 'jsonwebtoken';
//import crypto from 'crypto';
import User from '../models/User.js';
import Club from '../models/Club.js';
import DSW from '../models/DSW.js';
import FC from '../models/FacultyCoordinator.js';
import Admin from '../models/Admin.js';

//const secret = crypto.randomBytes(64).toString('hex');

/* const verifyToken = (req, res, next) => {
	const token = req.header['x-access-token'];
	console.log(token);
	if(!token) return res.status(401).send({ success: false, message: 'No token provided.' });
	jwt.verify(token, secret, (err, decoded) => {
		if(err) return res.status(500).send({ success: false, message: 'Something went wrong' });
		req.userId = decoded.id;
		next();
	});
} */

const verifyUser = async (req, res, next) => {
	if(!req.session.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
	User.findById(req.session.userId)
		.then(user => {
			if(!user) return res.status(401).json({ success: false, message: 'Unauthorized' });
			next();
		});
}

const verifyClub = async (req, res, next) => {
	if(!req.session.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
	Club.findById(req.session.userId)
		.then(club => {
			if(!club) return res.status(401).json({ success: false, message: 'Unauthorized' });
			next();
		});
}

const verifyFC = async (req, res, next) => {
	if(!req.session.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
	FC.findById(req.session.userId)
		.then(fc => {
			if(!fc) return res.status(401).json({ success: false, message: 'Unauthorized' });
			next();
		});
}

const verifyDSW = async (req, res, next) => {
	if(!req.session.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
	DSW.findById(req.session.userId)
		.then(dsw => {
			if(!dsw) return res.status(401).json({ success: false, message: 'Unauthorized' });
			next();
		});
}

const verifyAdmin = async (req, res, next) => {
	if(!req.session.userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
	Admin.findById(req.session.userId)
		.then(admin => {
			if(!admin) return res.status(401).json({ success: false, message: 'Unauthorized' });
			next();
		});
}

export { verifyUser, verifyClub, verifyFC, verifyDSW, verifyAdmin };
