import express from "express";
import mongoose from "mongoose";

import Club from "../../models/Club.js";
import Proposal from "../../models/Proposal.js";
import Event from "../../models/Event.js";

import { verifyClub } from "../../middlewares/checkAuth.js";

const router = express.Router();


// TODO: Route to change visibility of event after approval == 3
// TODO: Route to delete event required? Since we can't delete proposal for sake of keeping info, we can add cancelled attribute

router.get("/", verifyClub, async (req, res) => {
    Event.find({clubId: req.session.userId})
    .select('club clubId title description date')
        .then(eventsList => {
            res.status(200).json({success: true, events: eventsList})
        })
        .catch(err => {
            res.status(500).send({success: false, message: "Failed to query database", error: err})
        })
});


// Get event by id
router.get("/:id", verifyClub, async (req, res) => {
    // TODO
    Event.findById(req.params.id)
        .where('clubId').equals(req.session.userId)
        .select('club clubId title description date visible')
        .then(event => {
            if (event){
                res.status(200).json({success: true, event: event})
            }
            else{
                res.status(404).send({success: false, message: "Not found"})
            }
        })
        .catch(err => {
            res.status(500).send({success: false, message: "Failed to query database", error: err})
        })
});


router.put("/:id", verifyClub, async (req, res) => {
    // TODO: At what stage and what fields will club be allowed to edit
	Event.findById(req.params.id)
		.then(event => {
			if (event.clubId == req.session.userId) {
                
                // Can be improved, possibly move updatablefield validation to model
                const updatableFields = ["title", "description", "visible", "date"]
                updatableFields.forEach(function(item){
                    if (req.body[item] !== undefined){
                        event[item] = req.body[item]
                    }
                })

                event.save()
					.then(eventUpdated => {
						res.status(200).send({ success: true, id: eventUpdated.id })
					})
					.catch(err => {
						res.status(500).send({success: false, message: "Failed to update proposal", error: err})
					})
			}
			else {
				res.status(403).send({ success: false, message: "You do not have access to this event" })
			}
		})
		.catch((err) => {
			res.status(404).send({ success: false, message: "Event not found", error: err })
		})

});

export default router;