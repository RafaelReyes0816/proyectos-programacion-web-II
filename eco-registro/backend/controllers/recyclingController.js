import { RecyclingModel } from "../models/recyclingModel.js";

export const RecyclingController = {
  getAllRecords: (req, res) => {
    try {
      const registros = RecyclingModel.getAll();
      
      const totalesPorTipo = {};
      let totalGeneral = 0;
      
      if (Array.isArray(registros)) {
        registros.forEach(registro => {
          const tipo = registro.tipo;
          const cantidad = Number(registro.cantidad) || 0;
          
          if (!totalesPorTipo[tipo]) {
            totalesPorTipo[tipo] = 0;
          }
          totalesPorTipo[tipo] += cantidad;
          totalGeneral += cantidad;
        });
      }
      
      res.json({
        registros: registros || [],
        totalesPorTipo,
        totalGeneral
      });
    } catch (error) {
      console.error("Error en getAllRecords:", error);
      res.status(500).json({ 
        error: "Error al obtener los registros",
        registros: [],
        totalesPorTipo: {},
        totalGeneral: 0
      });
    }
  },

  addRecord: (req, res) => {
    try {
      const { tipo, cantidad } = req.body;

      if (!tipo || !cantidad) {
        return res.status(400).json({ error: "Tipo y cantidad son requeridos" });
      }

      const newRecord = RecyclingModel.create(tipo, cantidad);
      res.status(201).json(newRecord);
    } catch (error) {
      console.error("Error en addRecord:", error);
      res.status(500).json({ error: "Error al agregar el registro" });
    }
  },

  deleteRecord: (req, res) => {
    const { id } = req.params;
    const record = RecyclingModel.findById(id);
    
    if (!record) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    
    RecyclingModel.delete(id);
    res.json({ message: "Registro eliminado correctamente" });
  }
};
