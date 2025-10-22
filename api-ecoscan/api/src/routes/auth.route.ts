import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { StatusCodes } from "http-status-codes";

export const authRoute = Router();

// Rota para buscar dados do utilizador autenticado
authRoute.get("/me", authMiddleware, (req, res) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Usuário não autenticado" });
  }
  res.status(StatusCodes.OK).json(req.user);
});

authRoute.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return res.status(StatusCodes.OK).json({ message: "Logout bem-sucedido." });
});