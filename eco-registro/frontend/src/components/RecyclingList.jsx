import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/recycling";

export default function RecyclingList() {
  const [registros, setRegistros] = useState([]);
  const [totalesPorTipo, setTotalesPorTipo] = useState({});
  const [totalGeneral, setTotalGeneral] = useState(0);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    tipo: "Plástico",
    cantidad: ""
  });

  // Obtener todos los registros
  const fetchRegistros = async () => {
    try {
      const response = await axios.get(API_URL);
      // Validar que la respuesta tenga la estructura correcta
      if (response.data && Array.isArray(response.data.registros)) {
        setRegistros(response.data.registros || []);
        setTotalesPorTipo(response.data.totalesPorTipo || {});
        setTotalGeneral(response.data.totalGeneral || 0);
      } else {
        // Si viene solo un array (respuesta antigua), manejarlo
        if (Array.isArray(response.data)) {
          setRegistros(response.data);
          setTotalesPorTipo({});
          setTotalGeneral(0);
        } else {
          setRegistros([]);
          setTotalesPorTipo({});
          setTotalGeneral(0);
        }
      }
    } catch (error) {
      console.error("Error al obtener registros:", error);
      // Solo mostrar alerta si es un error de conexión
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        alert("Error al cargar los registros. Asegúrate que el backend esté ejecutándose en http://localhost:4000");
      }
      // En caso de otros errores, mantener los datos actuales
      setRegistros([]);
      setTotalesPorTipo({});
      setTotalGeneral(0);
    }
  };

  // Agregar nuevo registro
  const agregarRegistro = async () => {
    if (!nuevoRegistro.cantidad || nuevoRegistro.cantidad <= 0) {
      alert("Por favor ingresa una cantidad válida");
      return;
    }

    try {
      // Asegurar que la cantidad se envíe como número
      const payload = { ...nuevoRegistro, cantidad: Number(nuevoRegistro.cantidad) };
      await axios.post(API_URL, payload);
      setNuevoRegistro({ tipo: "Plástico", cantidad: "" });
      // Pequeño delay para asegurar que el archivo se guardó antes de recargar
      setTimeout(() => {
        fetchRegistros();
      }, 100);
      alert("✅ Registro agregado exitosamente!");
    } catch (error) {
      console.error("Error al agregar registro:", error);
      alert("Error al agregar el registro");
    }
  };

  // Eliminar registro
  const eliminarRegistro = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchRegistros();
        alert("🗑️ Registro eliminado exitosamente!");
      } catch (error) {
        console.error("Error al eliminar registro:", error);
        alert("Error al eliminar el registro");
      }
    }
  };

  // Cargar registros al iniciar
  useEffect(() => {
    fetchRegistros();
  }, []);

  // Función para obtener clase CSS según el tipo
  const getBadgeClass = (tipo) => {
    const classes = {
      'Plástico': 'eco-badge badge-plastico',
      'Papel': 'eco-badge badge-papel',
      'Vidrio': 'eco-badge badge-vidrio',
      'Metal': 'eco-badge badge-metal'
    };
    return classes[tipo] || 'eco-badge';
  };

  return (
    <div className="eco-container">
      
      {/* Header */}
      <div className="eco-header">
        <h1 className="eco-title">♻️ EcoRegistro</h1>
        <p style={{ color: '#6b7280' }}>
          Sistema de registro comunitario de materiales reciclados
        </p>
      </div>

      {/* Estadísticas */}
      <div className="eco-card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#374151' }}>
          📊 Estadísticas Totales
        </h2>
        <div className="eco-stats-grid">
          <div className="eco-stat-card eco-stat-total">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
              {totalGeneral.toFixed(2)}
            </div>
            <div style={{ color: '#15803d' }}>kg Totales</div>
          </div>
          {Object.entries(totalesPorTipo).map(([tipo, cantidad]) => (
            <div key={tipo} className="eco-stat-card eco-stat-item">
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{cantidad.toFixed(2)}</div>
              <div style={{ color: '#374151' }}>{tipo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario para nuevo registro */}
      <div className="eco-card">
        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: '#374151' }}>
          ➕ Agregar Nuevo Registro
        </h2>
        <div className="eco-form-grid">
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Tipo de Material
            </label>
            <select
              value={nuevoRegistro.tipo}
              onChange={(e) => setNuevoRegistro({...nuevoRegistro, tipo: e.target.value})}
              className="eco-input"
            >
              <option value="Plástico">🟡 Plástico</option>
              <option value="Papel">🔵 Papel</option>
              <option value="Vidrio">🟢 Vidrio</option>
              <option value="Metal">⚫ Metal</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Cantidad (kg)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={nuevoRegistro.cantidad}
              onChange={(e) => setNuevoRegistro({...nuevoRegistro, cantidad: e.target.value})}
              placeholder="Ej: 2.5"
              className="eco-input"
            />
          </div>
          
          <div>
            <button
              onClick={agregarRegistro}
              className="eco-btn eco-btn-primary"
            >
              📥 Agregar Registro
            </button>
          </div>
        </div>
      </div>

      {/* Lista de registros */}
      <div className="eco-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#374151' }}>
            📋 Registros de Reciclaje
          </h2>
          <button
            onClick={fetchRegistros}
            className="eco-btn eco-btn-secondary"
          >
            🔄 Actualizar
          </button>
        </div>

        {registros.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <p style={{ fontSize: '1.125rem', marginBottom: '10px' }}>No hay registros de reciclaje aún.</p>
            <p>¡Comienza agregando el primer registro!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="eco-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Cantidad (kg)</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.id}>
                    <td>#{registro.id}</td>
                    <td>
                      <span className={getBadgeClass(registro.tipo)}>
                        {registro.tipo}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>
                      {registro.cantidad} kg
                    </td>
                    <td>
                      {new Date(registro.id).toLocaleDateString('es-ES')}
                    </td>
                    <td>
                      <button
                        onClick={() => eliminarRegistro(registro.id)}
                        className="eco-btn eco-btn-danger"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="eco-footer">
        <p>♻️ EcoRegistro - Contribuyendo a un planeta más verde</p>
      </div>
    </div>
  );
}