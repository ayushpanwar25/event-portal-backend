import express from "express";
import mongoose from "mongoose";
import Club from "../../models/Club.js";
import Proposal from "../../models/Proposal.js";
import { verifyClub } from "../../middlewares/checkAuth.js";
import { validateProposal } from "../../utils/validate.js";

const router = express.Router();
router.use(verifyClub);

router.get("/", async (req, res) => {
  Proposal.find({ clubId: req.session.userId }).then((proposals) => {
    return res.json({ success: true, proposals });
  });
});

router.get("/:id", async (req, res) => {
  Proposal.findById(req.params.id).then((proposal) => {
    if (!proposal) {
      return res
        .status(500)
        .send({ success: false, message: "Proposal not found" });
    }
    if (proposal.clubId.equals(req.session.userId)) {
      return res.json({ success: true, proposal });
    } else {
      return res.status(403).send({ success: false, message: "Forbidden" });
    }
  });
});

router.post("/create", async (req, res) => {
  const errors = [];
  const validateError = validateProposal(req.body);
  if (validateError) {
    validateError.details.forEach((error) => {
      errors.push({
        key: error.path[0],
        message: error.message,
      });
    });
    return res.json({ success: false, errors });
  }
  // TODO: Do post saving operations
  Club.findById(req.session.userId)
    .then(async (club) => {
      // TODO: destructure req.body
      const proposal = new Proposal(req.body);
      proposal.clubName = club.name;
      proposal.clubId = mongoose.Types.ObjectId(club);
			proposal.facultyId = club.facultyId;
      proposal.approval = 0; // Prevent user insertion
      proposal
        .save()
        .then((proposal) => {
          return res
            .status(200)
            .send({ success: true, proposalId: proposal._id });
        })
        .catch((err) => {
          return res
            .status(500)
            .send({
              success: false,
              message: "Failed to create event",
              error: err,
            });
        });
    })
    .catch((err) => {
      return res.status(404).send({ success: false });
    });
});

router.get("/approve/:id", async (req, res) => {
	Proposal.findById(req.params.id).then((proposal) => {
		if (!proposal) {
			return res
				.status(404)
				.send({ success: false, message: "Proposal not found" });
		}
		else if (proposal.clubId.equals(req.session.userId) && proposal.approval == 0) {
			proposal.approval = 1;
			proposal.save().then(() => {
				return res.json({ success: true });
			})
			.catch((err) => {
				return res.status(500).json({ success: false });
			});
		}
		else {
			return res.status(403).send({ success: false, message: "Forbidden" });
		}
	});
});

router.put("/edit/:id", async (req, res) => {
  Proposal.findById(req.params.id)
    .then((proposal) => {
      if (proposal.clubId == req.session.userId && proposal.approval == 0) {
        // Prevent insertion of club details from user end
        delete req.body.approval;
        delete req.body.clubId;

        // Process update request
        Proposal.findByIdAndUpdate(req.params.id, req.body)
          .then((proposal) => {
            return res.status(200).send({ success: true });
          })
          .catch((err) => {
            return es.status(500).send({ success: false });
          });
      } else {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
    })
    .catch((err) => {
      return res.status(404).send({ success: false });
    });
});

router.delete("/:id", async (req, res) => {
  Proposal.findById(req.params.id)
    .then((proposal) => {
      if (proposal.clubId == req.session.userId && proposal.approval == 0) {
        //can only delete before forwarding to faculty
        Proposal.findByIdAndDelete(req.params.id)
          .then((proposal) => {
            return res.status(200).send({ success: true });
          })
          .catch((err) => {
            return res.status(500).send({ success: false });
          });
      } else {
        return res.status(403).send({ success: false, message: "Forbidden" });
      }
    })
    .catch((err) => {
      res.status(404).send({ success: false });
    });
});

export default router;
