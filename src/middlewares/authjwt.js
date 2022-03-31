import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const secret = crypto.randomBytes(64).toString('hex');

const verifyToken = (req, res, next) => {
	const token = req.headers['Authorization'];
	if(!token) return res.status(403).send({ success: false, message: 'No token provided.' });
	jwt.verify(token, secret, (err, decoded) => {
		if(err) return res.status(500).send({ success: false, message: 'Unauthorized' });
		req.userId = decoded.id;
		next();
	});
}

export { secret, verifyToken };
