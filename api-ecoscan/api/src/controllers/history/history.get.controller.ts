import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import type { HistoryService } from "../../services/history";

export const get =
  (historyService: HistoryService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id_user = req.user?.idUser;

      if (!id_user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Utilizador não autenticado." });
      }

      const history = await historyService.findHistoryByUserIdService(id_user);
      return res.status(StatusCodes.OK).json(history);
    } catch (error) {
      next(error);
    }
  };