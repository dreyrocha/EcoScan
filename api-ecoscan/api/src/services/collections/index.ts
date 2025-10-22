import type { CollectionRepository } from "../../database/repositories/collections";
import { create } from "./collection.create.service";
import { findByEnterprise } from "./collection.findByEnterprise.service";
import { remove } from "./collection.delete.service";

export const CollectionService = (repository: CollectionRepository) => ({
    createCollectionService: create(repository),
    findByEnterpriseService: findByEnterprise(repository),
    deleteCollectionService: remove(repository),
});

export type CollectionService = ReturnType<typeof CollectionService>;