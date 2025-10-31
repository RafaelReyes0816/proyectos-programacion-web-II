import { HabitModel } from "../models/habitModel.js";

export const HabitController = {
  getHabits: (req, res) => {
    try {
      const habits = HabitModel.getAll();
      res.json(habits);
    } catch (error) {
      console.error("Error en getHabits:", error);
      res.status(500).json({ error: "Error al obtener los hábitos" });
    }
  },

  addHabit: (req, res) => {
    try {
      const { nombre } = req.body;
      if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ error: "El nombre es requerido" });
      }
      const newHabit = HabitModel.create(nombre.trim());
      res.status(201).json(newHabit);
    } catch (error) {
      console.error("Error en addHabit:", error);
      res.status(500).json({ error: "Error al agregar el hábito" });
    }
  },

  toggleHabit: (req, res) => {
    try {
      const { id } = req.params;
      const habit = HabitModel.findById(id);
      
      if (!habit) {
        return res.status(404).json({ error: "Hábito no encontrado" });
      }
      
      const updatedHabit = HabitModel.toggle(id);
      res.json(updatedHabit);
    } catch (error) {
      console.error("Error en toggleHabit:", error);
      res.status(500).json({ error: "Error al actualizar el hábito" });
    }
  },

  deleteHabit: (req, res) => {
    try {
      const { id } = req.params;
      const habit = HabitModel.findById(id);
      
      if (!habit) {
        return res.status(404).json({ error: "Hábito no encontrado" });
      }
      
      HabitModel.delete(id);
      res.json({ message: "Hábito eliminado" });
    } catch (error) {
      console.error("Error en deleteHabit:", error);
      res.status(500).json({ error: "Error al eliminar el hábito" });
    }
  }
};
