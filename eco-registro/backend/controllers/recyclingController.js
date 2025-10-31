import { RecyclingModel } from "../models/recyclingModel.js";

export const RecyclingController = {
  getAllRecords: (req, res) => {
    const data = RecyclingModel.getAll();
    res.json(data);
  },

  addRecord: (req, res) => {
    const { tipo, cantidad } = req.body;

    if (!tipo || !cantidad) {
      return res.status(400).json({ error: "Tipo y cantidad son requeridos" });
    }

    const newRecord = RecyclingModel.create(tipo, cantidad);
    res.status(201).json(newRecord);
  },

  deleteRecord: (req, res) => {
    const { id } = req.params;
    RecyclingModel.delete(id);
    res.json({ message: "Registro eliminado correctamente" });
  }
};
