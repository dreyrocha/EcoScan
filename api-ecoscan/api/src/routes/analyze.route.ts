// src/routes/analyze.route.ts
import { Router, type RequestHandler } from "express";
import { authMiddleware } from "../middlewares/auth.middleware"; //
import { analyzeController } from "../controllers/analyze.controller";

export const analyzeRoute = Router();

analyzeRoute.post(
  "/analyze",
  // authMiddleware, 
  analyzeController as RequestHandler // Chama o controlador que criámos
);
