import Proposal from "../../models/Proposal";
import express from "express";
import { verifyAdmin } from "../../middlewares/checkAuth";

const router = express.Router();

router.get("/get", verifyAdmin, async (req, res) => {
    const proposals = await Proposal.find({});
    res.send(proposals);
});

router.get("/get/:id", verifyAdmin, async (req, res) => {
	const _id = req.params.id;
    const proposal = await Proposal.findById({ _id });
    res.send(proposal);
});

router.get('/newproposal', verifyAdmin, async (req, res) => {
    res.send('New proposal input field');
})

router.post('/newproposal', verifyAdmin, (req, res) => {
    const newProposal = new Proposal(req.body);
    await newProposal.save();
    res.send('Saved')
})

router.get('/update/:id', verifyAdmin, async(req, res) => {
    const _id = req.params.id;
    const proposal = await Proposal.findById({ _id });
    res.send(proposal);
})

router.post('/update/:id', verifyAdmin, async(req, res) => {
    const _id = req.params.id;
    const proposal = await Proposal.findByIdAndUpdate( _id, req.body );
    await proposal.save();
    res.send('Updated');
})


router.post("/delete/:id", verifyAdmin, async (req, res) => {
    const _id = req.params.id;
    await Proposal.findByIdAndDelete({ _id });
    res.send('Deleted');
});

export default router;
