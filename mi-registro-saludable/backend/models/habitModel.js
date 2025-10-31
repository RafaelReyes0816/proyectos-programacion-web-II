import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "../data/habits.json");

const dataDir = path.join(__dirname, "../data");
if (!fs.existsSync(dataDir)) {
  console.log("Creando directorio data...");
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dataFilePath)) {
  console.log("Creando archivo habits.json inicial...");
  fs.writeFileSync(dataFilePath, "[]", "utf-8");
}

const loadData = () => {
  try {
    console.log("Leyendo datos desde:", dataFilePath);
    const data = fs.readFileSync(dataFilePath, "utf-8");
    console.log("Datos leídos:", data);
    
    if (!data || data.trim() === "") {
      console.log("Archivo vacío, retornando array vacío");
      return [];
    }
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.warn("Los datos no son un array, inicializando vacío");
      return [];
    }
    return parsed;
  } catch (error) {
    console.error("Error al cargar datos:", error);
    console.error("Stack:", error.stack);
  }
  return [];
};

const saveData = (data) => {
  try {
    console.log("Intentando guardar datos:", JSON.stringify(data));
    
    if (!Array.isArray(data)) {
      console.error("Error: Los datos no son un array:", typeof data);
      throw new Error("Los datos deben ser un array");
    }
    
    // Validar cada hábito
    data.forEach(habit => {
      if (!habit.id || !habit.nombre) {
        console.error("Hábito inválido:", habit);
        throw new Error("Datos de hábito inválidos");
      }
    });
    
    const jsonString = JSON.stringify(data, null, 2);
    
    // Verificar que es JSON válido
    JSON.parse(jsonString);
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(dataDir)) {
      console.log("Recreando directorio data...");
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    console.log("Guardando en:", dataFilePath);
    fs.writeFileSync(dataFilePath, jsonString, "utf-8");
    
    // Verificar que se guardó
    if (!fs.existsSync(dataFilePath)) {
      throw new Error("El archivo no se creó correctamente");
    }
    
    console.log("Datos guardados exitosamente");
    return true;
  } catch (error) {
    console.error("Error al guardar datos:", error);
    console.error("Stack:", error.stack);
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
    if (!nombre || typeof nombre !== 'string') {
      console.error("Nombre inválido:", nombre);
      throw new Error("El nombre debe ser un string no vacío");
    }

    console.log("Creando nuevo hábito:", nombre);
    const habits = loadData();
    
    const newHabit = {
      id: Date.now(),
      nombre: nombre.trim(),
      cumplido: false
    };
    
    console.log("Nuevo hábito a guardar:", newHabit);
    habits.push(newHabit);
    
    try {
      saveData(habits);
      console.log("Hábito guardado correctamente");
      return newHabit;
    } catch (error) {
      console.error("Error al guardar nuevo hábito:", error);
      throw new Error("No se pudo guardar el hábito: " + error.message);
    }
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
