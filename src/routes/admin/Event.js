import Event from "../../models/Event";
import express from "express";
import { verifyAdmin } from "../../middlewares/checkAuth";

const router = express.Router();
router.use(verifyAdmin);

router.get("/", async (req, res) => {});

router.get("/:id", async (req, res) => {});

router.delete("/:id", async (req, res) => {});

export default router;
