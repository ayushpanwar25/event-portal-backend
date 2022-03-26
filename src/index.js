import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();
mongoose
	.connect(process.env.MONGO_URL)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

//error "handler"
app.use(function (err, req, res, next) {
	res.status(500).send("Something went wrong with the server");
});

app.use(
	cors({
		origin: true,
		credentials: true,
		methods: ["GET", "POST", "DELETE", "OPTIONS"],
		optionsSuccessStatus: 200
	})
);

app.listen(parseInt(process.env.PORT), () =>
	console.log("API listening on port " + process.env.PORT)
);
