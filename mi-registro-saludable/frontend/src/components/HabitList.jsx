import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/habits";

export default function HabitList() {
  const [habits, setHabits] = useState([]);
  const [nombre, setNombre] = useState("");

  const fetchHabits = async () => {
    const res = await axios.get(API_URL);
    setHabits(res.data);
  };

  const addHabit = async () => {
    if (!nombre) return;
    await axios.post(API_URL, { nombre });
    setNombre("");
    fetchHabits();
  };

  const toggleHabit = async (id) => {
    await axios.put(`${API_URL}/${id}/toggle`);
    fetchHabits();
  };

  const deleteHabit = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchHabits();
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-green-100 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
        Mi Registro Saludable
      </h1>

      <div className="flex mb-4">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nuevo hábito..."
          className="border p-2 flex-1 rounded-l"
        />
        <button onClick={addHabit} className="bg-green-500 text-white px-4 rounded-r">
          Agregar
        </button>
      </div>

      <ul>
        {habits.map((habit) => (
          <li
            key={habit.id}
            className="flex justify-between items-center p-2 bg-white mb-2 rounded shadow-sm"
          >
            <span
              onClick={() => toggleHabit(habit.id)}
              className={`cursor-pointer ${
                habit.cumplido ? "line-through text-gray-500" : ""
              }`}
            >
              {habit.nombre}
            </span>
            <button
              onClick={() => deleteHabit(habit.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
