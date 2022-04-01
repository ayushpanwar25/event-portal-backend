import Proposal from "../../models/Proposal";
import express from "express";
import { verifyAdmin } from "../../middlewares/checkAuth";

const router = express.Router();

router.get("/get", verifyAdmin, async (req, res) => {

});

router.get("/get/:id", verifyAdmin, async (req, res) => {
	
});


router.delete("/delete/:id", verifyAdmin, async (req, res) => {

});

export default router;
