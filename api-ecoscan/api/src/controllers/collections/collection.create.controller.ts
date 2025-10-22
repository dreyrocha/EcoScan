import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { CollectionService } from "../../services/collections";

export const create = (service: CollectionService) => async (req: Request, res: Response) => {
    try {
        const { id_enterprise, amount_collected_kg, collection_date, waste_type } = req.body;
        if (!id_enterprise || !amount_collected_kg || !collection_date || !waste_type) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Todos os campos são obrigatórios." });
        }
        const newCollection = await service.createCollectionService(id_enterprise, amount_collected_kg, collection_date, waste_type);
        return res.status(StatusCodes.CREATED).json(newCollection);
    } catch (error) {
        console.error("Erro ao criar registo de coleta:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao criar registo." });
    }
};