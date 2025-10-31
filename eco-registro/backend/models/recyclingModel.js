import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.join(__dirname, "../data/recyclingRecords.json");

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

export const RecyclingModel = {
  getAll: () => {
    return loadData();
  },

  findById: (id) => {
    const records = loadData();
    return records.find(record => record.id === Number(id));
  },

  create: (tipo, cantidad) => {
    const records = loadData();
    const newRecord = {
      id: Date.now(),
      tipo,
      cantidad: Number(cantidad)
    };
    records.push(newRecord);
    saveData(records);
    return newRecord;
  },

  delete: (id) => {
    const records = loadData();
    const record = records.find(record => record.id === Number(id));
    if (!record) return false;
    
    const updatedRecords = records.filter(record => record.id !== Number(id));
    saveData(updatedRecords);
    return true;
  }
};
