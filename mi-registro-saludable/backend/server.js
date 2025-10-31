import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import habitRoutes from "./routes/habitRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/habits", habitRoutes);

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Servidor Mi Registro Saludable corriendo en http://localhost:${PORT}`)
);
