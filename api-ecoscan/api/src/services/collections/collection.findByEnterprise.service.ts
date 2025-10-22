import type { CollectionRepository } from "../../database/repositories/collections";

export const findByEnterprise = (repository: CollectionRepository) => async (id_enterprise: string) => {
    return repository.findByEnterprise(id_enterprise);
};