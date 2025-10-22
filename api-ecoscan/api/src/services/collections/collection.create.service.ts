import type { CollectionRepository } from "../../database/repositories/collections";

export const create = (repository: CollectionRepository) => async (
    id_enterprise: string,
    amount_collected_kg: number,
    collection_date: string,
    waste_type: string
) => {
    
    return repository.createCollection(id_enterprise, amount_collected_kg, collection_date, waste_type);
};