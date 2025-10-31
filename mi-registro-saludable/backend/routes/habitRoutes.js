import express from "express";
import { HabitController } from "../controllers/habitController.js";

const router = express.Router();

router.get("/", HabitController.getHabits);
router.post("/", HabitController.addHabit);
router.put("/:id/toggle", HabitController.toggleHabit);
router.delete("/:id", HabitController.deleteHabit);

export default router;
