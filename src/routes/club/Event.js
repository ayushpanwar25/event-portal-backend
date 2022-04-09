import express from "express";
import Event from "../../models/Event.js";

import { verifyClub } from "../../middlewares/checkAuth.js";

const router = express.Router();
router.use(verifyClub);

router.get("/", async (req, res) => {
	Event.find({ clubId: req.session.userId })
		.select('club clubId title description date')
		.then(events => {
			return res.status(200).json({ success: true, events })
		})
		.catch(err => {
			return res.status(500).send({ success: false, message: "Failed to query database" })
		});
});

// Get event by id
router.get("/:id", async (req, res) => {
	Event.findById(req.params.id)
		.where('clubId').equals(req.session.userId)
		.select('club clubId title description date visible')
		.then(event => {
			if (!event) {
				return res.status(404).send({ success: false });
			}
			return res.status(200).json({ success: true, event });
			})
		.catch(err => {
			return res.status(500).send({ success: false, message: "Failed to query database" })
		});
});

router.put("/:id", async (req, res) => {
	Event.findById(req.params.id)
		.then(async (event) => {
			if (event.clubId != req.session.userId) {
				return res.status(403).send({ success: false, message: "Unauthorized" });
			}
			const updatableFields = ["title", "description", "visible", "date"];
			updatableFields.forEach(function (item) {
				if (req.body[item] !== undefined) {
					event[item] = req.body[item];
				}
			});
			event.save()
				.then(event => {
						return res.status(200).send({ success: true, eventId: event._id });
				})
				.catch(err => {
						return res.status(500).send({ success: false, message: "Failed to update proposal" });
				});
		})
		.catch(err => {
			return res.status(404).send({ success: false });
		});
});

// Delete event by id
router.delete("/:id", verifyClub, async (req, res) => {
	Event.findById(req.params.id)
		where('clubId').equals(req.session.userId)
		.then(async (event) => {
			if(!event) return res.status(404).send({ success: false });
			event.delete()
				.then(() => {
					return res.status(200).send({ success: true });
				})
				.catch(err => {
					return res.status(500).send({ success: false });
				});
			})
			.catch(err => {
				return res.status(500).send({ success: false, message: "Failed to query database" })
			});
});

export default router;
