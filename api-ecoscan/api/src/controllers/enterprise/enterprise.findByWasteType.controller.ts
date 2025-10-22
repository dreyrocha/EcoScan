import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { EnterpriseService } from "../../services/enterprise";

export const findByWasteType =
  (enterpriseService: EnterpriseService) =>
  async (req: Request, res: Response) => {
    try {
      // O tipo de resíduo virá como um parâmetro de query (ex: /search?type=Vidro)
      const { type } = req.query;

      if (!type || typeof type !== 'string') {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "O parâmetro 'type' é obrigatório." });
      }

      const enterprises = await enterpriseService.findEnterpriseByWasteTypeService(type);

      return res.status(StatusCodes.OK).json(enterprises);
    } catch (error) {
      console.error("Erro ao buscar empresas por tipo de resíduo:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao buscar empresas" });
    }
  };