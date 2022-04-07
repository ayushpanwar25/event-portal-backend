import express from "express";
import mongoose from "mongoose";

import Event from "../../models/Event.js";

import { verifyUser, verifyClub } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/register", verifyUser, async (req, res) => {

});

// Get all events list
router.get("/", verifyUser, async (req, res) => {
    // TODO: Is pagination needed?
    Event.find({visible: true})
        .select('club clubId title description date')
        .then(eventsList => {
            res.status(200).json({success: true, events: eventsList})
        })
        .catch(err => {
            res.status(500).send({success: false, message: "Failed to query database", error: err})
        })
});

// Get event by id
router.get("/:id", verifyUser, async (req, res) => {
    // TODO
    Event.findById(req.params.id)
        .where('visible').equals(true) // We can add a condition check and send 403 is visibe false but this seems more secure
        .select('club clubId title description date')
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

export default router;
