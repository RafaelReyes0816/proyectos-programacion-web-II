import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "../data/habits.json");

const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const loadData = () => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, "utf-8");
      if (!data || data.trim() === "") {
        return [];
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
  return [];
};

const saveData = (data) => {
  try {
    if (!Array.isArray(data)) {
      throw new Error("Los datos deben ser un array");
    }
    
    const jsonString = JSON.stringify(data, null, 2);
    JSON.parse(jsonString);
    
    fs.writeFileSync(dataFilePath, jsonString, "utf-8");
    
    if (!fs.existsSync(dataFilePath)) {
      throw new Error("El archivo no se creó correctamente");
    }
  } catch (error) {
    console.error("Error al guardar datos:", error);
    throw error;
  }
};

export const HabitModel = {
  getAll: () => {
    return loadData();
  },

  findById: (id) => {
    const habits = loadData();
    return habits.find(habit => habit.id === Number(id));
  },

  create: (nombre) => {
    const habits = loadData();
    const newHabit = { id: Date.now(), nombre, cumplido: false };
    habits.push(newHabit);
    saveData(habits);
    return newHabit;
  },

  toggle: (id) => {
    const habits = loadData();
    const habit = habits.find(habit => habit.id === Number(id));
    if (!habit) return null;
    
    const updatedHabits = habits.map(habit =>
      habit.id === Number(id)
        ? { ...habit, cumplido: !habit.cumplido }
        : habit
    );
    
    saveData(updatedHabits);
    return updatedHabits.find(habit => habit.id === Number(id));
  },

  delete: (id) => {
    const habits = loadData();
    const habit = habits.find(habit => habit.id === Number(id));
    if (!habit) return false;
    
    const updatedHabits = habits.filter(habit => habit.id !== Number(id));
    saveData(updatedHabits);
    return true;
  }
};
