import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CollectionService } from "../../services/collections";

export const remove = (service: CollectionService) => async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.params;
        if (!collectionId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "ID da coleta é obrigatório." });
        }
        await service.deleteCollectionService(collectionId);
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error("Erro ao excluir coleta:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao excluir registo." });
    }
};