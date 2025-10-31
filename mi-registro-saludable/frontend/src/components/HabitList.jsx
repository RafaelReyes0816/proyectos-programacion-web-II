import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4001/api/habits";

export default function HabitList() {
  const [habits, setHabits] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    cumplidos: 0,
    porcentaje: 0
  });
  const [nuevoHabit, setNuevoHabit] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Crear instancia de axios
  const api = axios.create({
    baseURL: 'http://localhost:4001',
    timeout: 5000,
  });

  // Obtener todos los hábitos
  const obtenerHabits = async () => {
    try {
      setCargando(true);
      setError("");
      
      const response = await api.get("/api/habits");
      setHabits(response.data.habits);
      setEstadisticas(response.data.estadisticas);
    } catch (error) {
      console.error("❌ Error al obtener hábitos:", error);
      let mensajeError = "Error al cargar los hábitos. ";
      
      if (error.code === 'ECONNREFUSED') {
        mensajeError += "El backend no está ejecutándose en el puerto 4001.";
      } else if (error.response) {
        mensajeError += `Error ${error.response.status}: ${error.response.data.error || 'Error del servidor'}`;
      } else if (error.request) {
        mensajeError += "No se recibió respuesta del servidor.";
      } else {
        mensajeError += error.message;
      }
      
      setError(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  // Agregar nuevo hábito
  const agregarHabit = async () => {
    if (!nuevoHabit.trim()) {
      alert("Por favor ingresa un nombre para el hábito");
      return;
    }

    try {
      setError("");
      await api.post("/api/habits", { nombre: nuevoHabit });
      setNuevoHabit("");
      await obtenerHabits();
      alert("✅ Hábito agregado exitosamente!");
    } catch (error) {
      console.error("Error al agregar hábito:", error);
      alert("Error al agregar el hábito: " + (error.response?.data?.error || error.message));
    }
  };

  // Eliminar hábito
  const eliminarHabit = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este hábito?")) {
      try {
        setError("");
        await api.delete(`/api/habits/${id}`);
        await obtenerHabits();
        alert("🗑️ Hábito eliminado exitosamente!");
      } catch (error) {
        console.error("Error al eliminar hábito:", error);
        alert("Error al eliminar el hábito");
      }
    }
  };

  // Marcar/desmarcar como cumplido
  const toggleHabit = async (id) => {
    try {
      setError("");
      await api.put(`/api/habits/${id}/toggle`);
      await obtenerHabits();
    } catch (error) {
      console.error("Error al actualizar hábito:", error);
      alert("Error al actualizar el hábito");
    }
  };

  // Cargar hábitos al iniciar
  useEffect(() => {
    obtenerHabits();
  }, []);

  return (
    <div className="health-container">
      
      {/* Header */}
      <div className="health-header">
        <h1 className="health-title">💪 Mi Registro Saludable</h1>
        <p>Lleva el control de tus hábitos diarios y mejora tu bienestar</p>
        
        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="health-card">
        <h2>📊 Mis Estadísticas</h2>
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {estadisticas.total}
            </div>
            <div>Total Hábitos</div>
          </div>
          
          <div className="stat-card stat-completed">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {estadisticas.cumplidos}
            </div>
            <div>Cumplidos</div>
          </div>
          
          <div className="stat-card stat-percentage">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {estadisticas.porcentaje}%
            </div>
            <div>Progreso</div>
          </div>
        </div>
      </div>

      {/* Formulario para nuevo hábito */}
      <div className="health-card">
        <h2>➕ Agregar Nuevo Hábito</h2>
        <div className="health-form">
          <div>
            <input
              type="text"
              value={nuevoHabit}
              onChange={(e) => setNuevoHabit(e.target.value)}
              placeholder="Ej: Beber 2 litros de agua, Hacer 30 min de ejercicio..."
              className="health-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') agregarHabit();
              }}
            />
          </div>
          
          <div>
            <button onClick={agregarHabit} className="health-btn btn-primary">
              📥 Agregar Hábito
            </button>
          </div>
        </div>
      </div>

      {/* Lista de hábitos */}
      <div className="health-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📋 Mis Hábitos</h2>
          <button onClick={obtenerHabits} className="health-btn btn-secondary">
            🔄 Actualizar
          </button>
        </div>

        {cargando ? (
          <div className="loading">
            <p>🔄 Cargando hábitos...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="loading">
            <p style={{ fontSize: '1.125rem', marginBottom: '10px' }}>No hay hábitos registrados aún.</p>
            <p>¡Comienza agregando tu primer hábito saludable!</p>
          </div>
        ) : (
          <ul className="habits-list">
            {habits.map((habit) => (
              <li key={habit.id} className={`habit-item ${habit.cumplido ? 'completed' : ''}`}>
                <div className="habit-content">
                  <input
                    type="checkbox"
                    checked={habit.cumplido}
                    onChange={() => toggleHabit(habit.id)}
                    className="habit-checkbox"
                  />
                  <span className={`habit-name ${habit.cumplido ? 'completed' : ''}`}>
                    {habit.nombre}
                  </span>
                </div>
                <div className="habit-actions">
                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className="health-btn btn-success"
                  >
                    {habit.cumplido ? '↩️ Desmarcar' : '✅ Cumplido'}
                  </button>
                  <button
                    onClick={() => eliminarHabit(habit.id)}
                    className="health-btn btn-danger"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="health-footer">
        <p>💪 Mi Registro Saludable - Tu compañero para una vida más saludable</p>
      </div>
    </div>
  );
}