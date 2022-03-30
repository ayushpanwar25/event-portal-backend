import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

//incase we need to throw an error
import ExpressErrorHandler from "./middlewares/ErrorHandlers/ExpressErrorHandler.js";

import authRouter from "./routes/auth.js";

mongoose
	.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true })
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
        const { status = 500, message = 'Something went wrong!' } = err;
        res.status(status).send(message);
})

app.listen(parseInt(process.env.PORT), () =>
	console.log("API listening on port " + process.env.PORT)
);
