import Proposal from "../models/Proposal";
import express from "express";
import router from "./ClubAuthentication";
import { verifyToken } from "../middlewares/authjwt";

const router = express.Router();

router.post("/review", verifyToken, async (req, res) => {

});

router.get("/getAll", verifyToken, async (req, res) => {

});

router.post("/create", verifyToken, async (req, res) => {

});

router.put("/edit", verifyToken, async (res, res) => {

});

router.delete("/delete", verifyToken, async (res, res) => {

});

export default router;