import express from "express";
import mongoose from "mongoose";

import Club from "../../models/Club.js";
import Proposal from "../../models/Proposal.js";
import Event from "../../models/Event.js";

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
			if (!proposal) {
				return res.status(500).send({ success: false, message: "Proposal not found" });
			}
			if (proposal.clubId.equals(req.session.userId)) {
				return res.json({ success: true, proposal });
			}
			else {
				return res.status(403).send({ success: false, message: "Forbidden" });
			}
		});
});


router.post("/create", verifyClub, async (req, res) => {
	const newProposal = new Proposal(req.body);

	// TODO: Do post saving operations
	Club.findById(req.session.userId)
		.then(club => {
			// Get club details
			newProposal.clubName = club.name
			newProposal.clubId = mongoose.Types.ObjectId(club)
			newProposal.approval = 0 // Prevent user insertion

			// Save proposal to database
			newProposal.save()
				.then((proposal) => {
					// Create a draft event
					const newEvent = new Event({
						clubId: newProposal.clubId,
						club: newProposal.clubName,
						title: newProposal.eventName,
						description: "",
						proposalId: proposal.id,
					})

					newEvent.save()
						.then(event => {
							res.status(200).send({ success: true, proposal_id: proposal.id, event_id: event.id })
						})
						.catch(err => {
							return res.status(500).send({ success: false, message: "Failed to create event", error: err });
						})
				})
				.catch((err) => {
					return res.status(400).send({ success: false, message: "Data validation failed", error: err });
				})
		})
		.catch((err) => {
			res.status(404).send({ success: false, message: "Cannot find club ID" })
		});

})

router.put("/edit/:id", verifyClub, async (req, res) => {
	// TODO: Add a check so club cannot edit major or any data once it's approved by faculty
	Proposal.findById(req.params.id)
		.then(proposal => {
			if (proposal.clubId == req.session.userId && proposal.approval == 0) {
				// Prevent insertion of club details from user end
				delete req.body.approval

				// Process update request
				Proposal.findByIdAndUpdate(req.params.id, req.body)
					.then(proposal => {
						res.status(200).send({ success: true, id: proposal.id })
					})
					.catch(err => {
						res.status(500).send({success: false, message: "Failed to update proposal"})
					})
			}
			else {
				res.status(403).send({ success: false, message: "You do not have access to this proposal" })
			}
		})
		.catch((err) => {
			res.status(404).send({ success: false, message: "Proposal not found", error: err })
		})

});

router.delete("/delete/:id", verifyClub, async (req, res) => {
	// TODO: Should clubs be allowed to simply delete a propoasl
	// TODO: Should there be a approval stage check so clubs can't delete at stage say  if it's approved by faculty
	Proposal.findById(req.params.id)
		.then(proposal => {
			if (proposal.clubId == req.session.userId) {
				Proposal.findByIdAndDelete(req.params.id)
					.then(deletedProposal => {
						res.status(200).send({ success: true })
					})
					.catch(err => {
						res.status(500).send({ success: false, message: "Failed to delete proposal" })
					})
			}
			else {
				res.status(403).send({ success: false, message: "You do not have access to this proposal" })
			}
		})
		.catch((err) => {
			res.status(404).send({ success: false, message: "Proposal not found", error: err })
		})

});

export default router;
