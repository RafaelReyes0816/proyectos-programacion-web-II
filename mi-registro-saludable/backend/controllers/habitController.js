import { HabitModel } from "../models/habitModel.js";

export const HabitController = {
  getHabits: (req, res) => {
    try {
      const habits = HabitModel.getAll();

      // Calcular estadísticas básicas para el frontend
      const total = Array.isArray(habits) ? habits.length : 0;
      const cumplidos = Array.isArray(habits) ? habits.filter(h => h.cumplido).length : 0;
      const porcentaje = total === 0 ? 0 : Math.round((cumplidos / total) * 100);

      res.json({
        habits: habits || [],
        estadisticas: {
          total,
          cumplidos,
          porcentaje
        }
      });
    } catch (error) {
      console.error("Error en getHabits:", error);
      res.status(500).json({ error: "Error al obtener los hábitos" });
    }
  },

  addHabit: (req, res) => {
    try {
      console.log('Recibido POST /api/habits con body:', req.body);
      
      const { nombre } = req.body;
      if (!nombre || nombre.trim() === "") {
        console.log('Error: nombre vacío');
        return res.status(400).json({ error: "El nombre es requerido" });
      }

      console.log('Creando hábito con nombre:', nombre);
      const newHabit = HabitModel.create(nombre.trim());
      
      console.log('Hábito creado:', newHabit);
      res.status(201).json(newHabit);
    } catch (error) {
      console.error("Error en addHabit:", error);
      console.error("Stack:", error.stack);
      res.status(500).json({ 
        error: "Error al agregar el hábito",
        details: error.message 
      });
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
