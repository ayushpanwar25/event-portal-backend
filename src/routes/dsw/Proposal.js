import Proposal from "../../models/Proposal.js";
import express from "express";
import { verifyDSW } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/approve/:id", verifyDSW, async (req, res) => {
	Proposal.findById(req.params.id)
		.then(async (proposal) => {
			if (!proposal) {
				return res.status(401).json({ success: false, message: "Proposal not found" });
			}
			else if (proposal.approval !== 2) {
				return res.status(403).json({ success: false, message: "Forbidden" });
			}
			else {
				proposal.approval = 3;
				await proposal.save();
				return res.json({ success: true, message: "Proposal approved" });
			}
		})
		.catch(err => {
			console.log(err);
			return res.status(500).json({ success: false, message: "Something went wrong" });
		});
});

router.get("/get", verifyDSW, async (req, res) => {
	Proposal.find({ approval: 2 })
		.then((proposals) => {
			return res.json({ success: true, proposals });
		});
});

router.get("/get/:id", verifyDSW, async (req, res) => {
	Proposal.findById(req.params.id)
		.then((proposal) => {
			if(!proposal) {
				return res.status(500).send({ success: false, message: "Proposal not found" });
			}
			if(proposal.approval !== 2) {
				return res.json({ success: false, message: "Forbidden" });
			}
			return res.json({ success: true, proposal });
		});
});

export default router;
