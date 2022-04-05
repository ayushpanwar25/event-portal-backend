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
	new Proposal(req.body)
		.then( async (newProposal) => {
			if(!newProposal) {
				return res.status(500).send({ success: false, message: "Something went wrong" });
			}
			if(newProposal.clubId.equals(req.session.userId)) {
				await newProposal.save();
				return res.json({ success: true, newProposal });
			}
			else {
				return res.status(403).send({ success: false, message: "Forbidden" });
			}
		})
});

router.put("/edit/:id", verifyClub, async (req, res) => {
	Proposal.findByIdAndUpdate(req.params.id, req.body)
		.then((proposal) => {
				if(!proposal) {
					return res.status(500).send({ success: false, message: "Proposal not found" });
				}
				if(proposal.clubId.equals(req.session.userId)) {
					return res.json({ success: true, message: "Proposal Updated" });
				}
				else {
					return res.status(403).send({ success: false, message: "Forbidden" });
				}
		});
});

router.delete("/delete/:id", verifyClub, async (req, res) => {
	Proposal.findByIdAndDelete(req.params.id)
		.then((proposal) => {
			if(!proposal) {
				return res.status(500).send({ success: false, message: "Proposal not found" });
			}
			if(proposal.clubId.equals(req.session.userId)) {
				return res.json({ success: true, message: "Proposal Deleted" });
			}
			else {
				return res.status(403).send({ success: false, message: "Forbidden" });
			}
		});
});

export default router;
