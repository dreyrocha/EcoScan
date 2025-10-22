import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CollectionService } from "../../services/collections";

export const getByEnterprise = (service: CollectionService) => async (req: Request, res: Response) => {
    try {
        const { enterpriseId } = req.params;
        if (!enterpriseId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "ID da empresa é obrigatório." });
        }
        const collections = await service.findByEnterpriseService(enterpriseId);
        return res.status(StatusCodes.OK).json(collections);
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao buscar coletas." });
    }
};