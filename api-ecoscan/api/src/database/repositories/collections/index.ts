import type { Pool } from "pg";
import { create } from "./collection.create.repository";
import { findByEnterprise } from "./collection.findByEnterprise.repository";
import { remove } from "./collection.delete.repository";

export const createCollectionRepository = (pool: Pool) => ({
    createCollection: create(pool),
    findByEnterprise: findByEnterprise(pool),
    deleteCollection: remove(pool),
});

export type CollectionRepository = ReturnType<typeof createCollectionRepository>;