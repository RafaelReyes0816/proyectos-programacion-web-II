import express from "express";
import { RecyclingController } from "../controllers/recyclingController.js";

const router = express.Router();

router.get("/", RecyclingController.getAllRecords);
router.post("/", RecyclingController.addRecord);
router.delete("/:id", RecyclingController.deleteRecord);

export default router;
