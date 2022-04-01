import Proposal from "../../models/Proposal.js";
import express from "express";
import { verifyClub } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.get("/get", verifyClub, async (req, res) => {
	Proposal.find({ clubId: req.session.userId })
		.then(async (proposals) => {
			return res.json({ success: true, proposals });
		});
});

router.get("/get/:id", verifyClub, async (req, res) => {
	Proposal.findById(req.params.id)
		.then((proposal) => {
			if(!proposal) {
				return res.status(500).send({ success: false, message: "Proposal not found" });
			}
			if(proposal.clubId.equals(req.session.userId)) {
				return res.json({ success: true, proposal });
			}
			else {
				return res.status(403).send({ success: false, message: "Forbidden" });
			}
		});
});


router.post("/create", verifyClub, async (req, res) => {

});

router.put("/edit/:id", verifyClub, async (req, res) => {

});

router.delete("/delete/:id", verifyClub, async (req, res) => {

});

export default router;
