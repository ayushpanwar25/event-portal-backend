import express from "express";
import Event from "../../models/Event.js";

const router = express.Router();

// Get all events list
router.get("/", async (req, res) => {
  // TODO: Pagination
  Event.find({ visible: true })
    .select("club clubId title description date")
    .then((events) => {
      res.json({ success: true, events });
    })
    .catch((error) => {
      res
        .status(500)
        .send({ success: false, message: "Failed to query database" });
    });
});

// Get event by id
router.get("/:id", async (req, res) => {
  Event.findById(req.params.id)
    .where("visible")
    .equals(true) // We can add a condition check and send 403 is visibe false but this seems more secure
    .select("club clubId title description date")
    .then((event) => {
      if (event) {
        res.status(200).json({ success: true, event });
      } else {
        res.status(404).send({ success: false });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ success: false, message: "Failed to query database" });
    });
});

export default router;
