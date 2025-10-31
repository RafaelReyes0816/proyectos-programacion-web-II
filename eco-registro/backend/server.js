import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import recyclingRoutes from "./routes/recyclingRoutes.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/recycling", recyclingRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
