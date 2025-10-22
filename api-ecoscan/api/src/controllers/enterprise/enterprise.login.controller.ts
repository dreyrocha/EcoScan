import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { EnterpriseService } from "../../services/enterprise";
import { AppError } from "../../errors/app.error";

export const login =
  (enterpriseService: EnterpriseService) =>
  async (req: Request, res: Response) => {
    try {
    
      const { cnpj, password } = req.body;
      if (!cnpj || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "CNPJ e senha são obrigatórios" });
      }


      const enterprise = await enterpriseService.loginEnterpriseService(cnpj, password);
      return res.status(StatusCodes.OK).json(enterprise);

    } catch (error) {
     
      if (error instanceof AppError && error.statusCode === StatusCodes.UNAUTHORIZED) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
      }
      console.error("Erro ao fazer login de empresa:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro interno ao fazer login" });
    }
  };