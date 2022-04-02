import Event from "../../models/Event.js";
import express from "express";
import { verifyUser } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/register", verifyUser, async (req, res) => {

});

export default router;
