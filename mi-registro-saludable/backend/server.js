import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import habitRoutes from "./routes/habitRoutes.js";

const app = express();

// Durante desarrollo permitir todas las orígenes (facilita probar desde Vite)
app.use(cors());

// Parsear JSON y aumentar límite
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/habits", habitRoutes);

const PORT = 4001;

// Manejo de errores globales para ayudar a debuggear
process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason) => {
  console.error('unhandledRejection:', reason);
});

// Health check endpoint for frontend connection tests
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Mi Registro Saludable" });
});

// Escuchar en todas las interfaces para evitar problemas de binding en algunos entornos
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Mi Registro Saludable corriendo en http://localhost:${PORT}`);
});

// Log que indica que el proceso está listo (útil para debugging)
console.log('Arrancando servidor Mi Registro Saludable...');
