import express from "express";
import mongoose from "mongoose";

import Club from "../../models/Club.js";
import Proposal from "../../models/Proposal.js";
import Event from "../../models/Event.js";

import { verifyClub } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.get("/", verifyClub, async (req, res) => {
    Event.find({ clubId: req.session.userId })
        .select('club clubId title description date')
        .then(eventsList => {
            res.status(200).json({ success: true, events: eventsList })
        })
        .catch(err => {
            res.status(500).send({ success: false, message: "Failed to query database", error: err })
        })
});


// Get event by id
router.get("/:id", verifyClub, async (req, res) => {
    // TODO
    Event.findById(req.params.id)
        .where('clubId').equals(req.session.userId)
        .select('club clubId title description date visible')
        .then(event => {
            if (event) {
                res.status(200).json({ success: true, event: event })
            }
            else {
                res.status(404).send({ success: false, message: "Not found" })
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: "Failed to query database", error: err })
        })
});


router.put("/:id", verifyClub, async (req, res) => {
    Event.findById(req.params.id)
        .then(async (event) => {
            if (event.clubId == req.session.userId) {

                // Verify approval stage for visible field
                if (req.body.visible == true){
                    try{
                        let proposal = await Proposal.findById(event.proposalId)
                        if (proposal.approval !== 3){
                            return res.status(400).send({success: false, message: "Proposal not approved"})
                        }
                    }
                    catch (err) {
                        res.status(500).send({success: false, message: "Failed to find proposal"})
                    }
                }

                // Can be improved, possibly move updatablefield validation to model
                const updatableFields = ["title", "description", "visible", "date"]
                updatableFields.forEach(function (item) {
                    if (req.body[item] !== undefined) {
                        event[item] = req.body[item]
                    }
                })

                event.save()
                    .then(eventUpdated => {
                        res.status(200).send({ success: true, id: eventUpdated.id })
                    })
                    .catch(err => {
                        res.status(500).send({ success: false, message: "Failed to update proposal", error: err })
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


// Delete event by id
router.delete("/:id", verifyClub, async (req, res) => {
    // TODO: Several issues with letting club deleet event
    // TODO: Should approval be automatically set to -1 if event deleted?
    // TODO: Does one proposal allow having multiple event?
    Event.findById(req.params.id)
        .where('clubId').equals(req.session.userId)
        .then(event => {
            if (event) {
                event.delete()
                .then(() => {
                    res.status(200).send({ success: true })
                })
                .catch(err => {
                    res.status(500).send({success: false, error: err})
                })
            }
            else {
                res.status(404).send({ success: false, message: "Not found" })
            }
        })
        .catch(err => {
            res.status(500).send({ success: false, message: "Failed to query database", error: err })
        })
});




export default router;