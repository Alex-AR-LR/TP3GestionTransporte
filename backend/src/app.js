import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "./config/passport.js";
import { requireAuth } from "./middlewares/auth.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import vehiculosRoutes from "./routes/vehiculos.routes.js";
import conductoresRoutes from "./routes/conductores.routes.js";
import viajesRoutes from "./routes/viajes.routes.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(passport.initialize());

// Públicas
app.use("/api/auth", authRoutes);

// Protegidas (JWT + Passport)
app.use("/api/vehiculos", requireAuth, vehiculosRoutes);
app.use("/api/conductores", requireAuth, conductoresRoutes);
app.use("/api/viajes", requireAuth, viajesRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
