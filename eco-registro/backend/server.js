import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import recyclingRoutes from "./routes/recyclingRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/recycling", recyclingRoutes);

// Health endpoint to allow frontend to verify backend is up
app.get('/health', (req, res) => {
	res.json({ status: 'ok', service: 'EcoRegistro' });
});

const PORT = 4000;

// Manejo de errores globales para debugging
process.on('uncaughtException', (err) => {
	console.error('uncaughtException (EcoRegistro):', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
	console.error('unhandledRejection (EcoRegistro):', reason);
});

// Escuchar en todas las interfaces
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Servidor Eco Reciclaje corriendo en http://localhost:${PORT}`);
});

console.log('Arrancando servidor EcoRegistro...');
