import { type RequestHandler, Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { HistoryFactory } from "../factories/history.factory";
import { HistoryController } from "../controllers/history";

export const historyRoutes = Router();
const historyController = HistoryController(HistoryFactory.getServiceInstance());

// Rota para obter o histórico do utilizador logado
historyRoutes.get(
  "/history",
  authMiddleware,
  historyController.getHistoryController as RequestHandler
);

// Rota para guardar um novo scan
historyRoutes.post(
  "/history",
  authMiddleware,
  historyController.createHistoryController as RequestHandler
);