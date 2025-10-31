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
    const habit = HabitModel.findById(id);
    
    if (!habit) {
      return res.status(404).json({ error: "Hábito no encontrado" });
    }
    
    const updatedHabit = HabitModel.toggle(id);
    res.json(updatedHabit);
  },

  deleteHabit: (req, res) => {
    const { id } = req.params;
    const habit = HabitModel.findById(id);
    
    if (!habit) {
      return res.status(404).json({ error: "Hábito no encontrado" });
    }
    
    HabitModel.delete(id);
    res.json({ message: "Hábito eliminado" });
  }
};
