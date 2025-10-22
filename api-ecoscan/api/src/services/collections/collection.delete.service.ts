import type { CollectionRepository } from "../../database/repositories/collections";

export const remove = (repository: CollectionRepository) => async (id_collection: string) => {
    const deleted = await repository.deleteCollection(id_collection);
    if (!deleted) throw new Error("Registo de coleta não encontrado.");
    return deleted;
};