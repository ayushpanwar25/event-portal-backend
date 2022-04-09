import Proposal from "../../models/Proposal.js";
import express from "express";
import { verifyFaculty } from "../../middlewares/checkAuth.js";

const router = express.Router();

router.post("/approve/:id", verifyFaculty, async (req, res) => {
  Proposal.findById(req.params.id)
    .then(async (proposal) => {
      if (!proposal) {
        return res
          .status(401)
          .json({ success: false, message: "Proposal not found" });
      }
      if (proposal.approval !== 1) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      } else {
        if (proposal.facultyId.equals(req.session.userId)) {
          proposal.approval = 2;
          await proposal.save();
          return res.json({
            success: true,
            message: "Proposal forwarded to DSW",
          });
        } else {
          return res.status(403).json({ success: false, message: "Forbidden" });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong" });
    });
});

router.get("/get", verifyFaculty, async (req, res) => {
  Proposal.find({ facultyId: req.session.userId, approval: 1 }).then(
    (proposals) => {
      return res.json({ success: true, proposals });
    }
  );
});

router.get("/get/:id", verifyFaculty, async (req, res) => {
  Proposal.findById(req.params.id).then((proposal) => {
    if (!proposal) {
      return res
        .status(500)
        .send({ success: false, message: "Proposal not found" });
    }
    if (
      !proposal.facultyId.equals(req.session.userId) ||
      proposal.approval !== 1
    ) {
      return res.status(403).send({ success: false, message: "Forbidden" });
    }
    return res.json({ success: true, proposal });
  });
});

export default router;
