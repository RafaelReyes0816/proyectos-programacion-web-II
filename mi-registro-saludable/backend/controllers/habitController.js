import { HabitModel } from "../models/habitModel.js";

export const HabitController = {
  getHabits: (req, res) => {
    res.json(HabitModel.getAll());
  },

  addHabit: (req, res) => {
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es requerido" });
    const newHabit = HabitModel.create(nombre);
    res.status(201).json(newHabit);
  },

  toggleHabit: (req, res) => {
    const { id } = req.params;
    HabitModel.toggle(id);
    res.json({ message: "Estado del hábito actualizado" });
  },

  deleteHabit: (req, res) => {
    const { id } = req.params;
    HabitModel.delete(id);
    res.json({ message: "Hábito eliminado" });
  }
};
