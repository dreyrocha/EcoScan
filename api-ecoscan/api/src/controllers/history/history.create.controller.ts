import { StatusCodes } from "http-status-codes";
import type { NextFunction, Response } from "express";
import type { HistoryService } from "../../services/history";
import type { BodyRequest } from "../../types/httpProps";

interface CreateHistoryBody {
  material_type: string;
  confidence: number;
  // O campo id_enterprise foi removido daqui
}

export const create =
  (historyService: HistoryService) =>
  async (
    req: BodyRequest<CreateHistoryBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { material_type, confidence } = req.body; // Apenas estes dois campos
      const id_user = req.user?.idUser;

      if (!id_user) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Utilizador não autenticado." });
      }

      await historyService.createHistoryService(
        id_user,
        material_type,
        confidence
        // O parâmetro id_enterprise foi removido daqui
      );

      return res.status(StatusCodes.CREATED).json({ message: "Scan guardado com sucesso." });
    } catch (error) {
      next(error);
    }
  };