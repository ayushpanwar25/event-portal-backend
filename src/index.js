import express from "express";
import mongoose from "mongoose";
//import redis from "redis";
//import connectRedis from "connect-redis";
import connectMongo from 'connect-mongo';
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";

import ClubAuthenticationRouter from "./routes/club/ClubAuthentication.js";
import FCAuthenticationRouter from "./routes/faculty/FCAuthentication.js";
import DSWAuthenticationRouter from "./routes/dsw/DSWAuthentication.js";
import ClubProposalRouter from "./routes/club/Proposal.js";
import FCProposalRouter from "./routes/faculty/Proposal.js";
import DSWProposalRouter from "./routes/dsw/Proposal.js";

const app = express();
dotenv.config();

const main = async () => {
	mongoose
	.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

	app.use(
		cors({
			origin: true,
			credentials: true
		})
	);

	/* const redisStore = connectRedis(session);
	const redisClient = redis.createClient();
	redisClient.on("error", (err) => console.log(err));
	await redisClient.connect(); */

	const mongoStore = connectMongo.create({
		mongoUrl: process.env.MONGO_URL,
		collectionName: 'sessions'
	});

	app.use(
		session({
			name: "connectid",
			//store: new redisStore({ client: redisClient, disableTouch: true }),
			store: mongoStore,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 3,
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production"
			},
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false
		})
	);

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	app.use("/api/club/auth", ClubAuthenticationRouter);
	app.use("/api/club/proposal", ClubProposalRouter);

	app.use("/api/faculty/auth", FCAuthenticationRouter);
	app.use("/api/faculty/proposal", FCProposalRouter);

	app.use("/api/dsw/auth", DSWAuthenticationRouter);
	app.use("/api/dsw/proposal", DSWProposalRouter);

	//error "handler"
	app.use(function (err, req, res, next) {
		res.status(500).send("Something went wrong with the server");
		next();
	});

	app.listen(parseInt(process.env.PORT), () =>
		console.log("API listening on port " + process.env.PORT)
	);
};

main().catch((error) => console.log(error));
