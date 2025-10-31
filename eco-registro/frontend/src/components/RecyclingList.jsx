import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/recycling";

export default function RecyclingList() {
  const [records, setRecords] = useState([]);
  const [tipo, setTipo] = useState("");
  const [cantidad, setCantidad] = useState("");

  const fetchRecords = async () => {
    const res = await axios.get(API_URL);
    setRecords(res.data);
  };

  const addRecord = async () => {
    if (!tipo || !cantidad) return;
    await axios.post(API_URL, { tipo, cantidad });
    setTipo("");
    setCantidad("");
    fetchRecords();
  };

  const deleteRecord = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const total = records.reduce((acc, rec) => acc + rec.cantidad, 0);

  return (
    <div className="p-6 max-w-md mx-auto bg-green-100 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">🌍 EcoRegistro</h1>

      <div className="flex mb-4">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 rounded-l flex-1"
        >
          <option value="">Tipo de material</option>
          <option value="Plástico">Plástico</option>
          <option value="Papel">Papel</option>
          <option value="Vidrio">Vidrio</option>
          <option value="Metal">Metal</option>
        </select>

        <input
          type="number"
          placeholder="Cantidad (kg)"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="border p-2 flex-1"
        />

        <button
          onClick={addRecord}
          className="bg-green-600 text-white px-4 rounded-r"
        >
          Agregar
        </button>
      </div>

      <ul>
        {records.map((rec) => (
          <li
            key={rec.id}
            className="flex justify-between items-center p-2 bg-white mb-2 rounded shadow-sm"
          >
            <span>{rec.tipo} - {rec.cantidad} kg</span>
            <button
              onClick={() => deleteRecord(rec.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold mt-4 text-center">
        ♻️ Total reciclado: {total} kg
      </h2>
    </div>
  );
}
