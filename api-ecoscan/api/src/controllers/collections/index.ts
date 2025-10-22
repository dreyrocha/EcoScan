import type { CollectionService } from "../../services/collections";
import { create } from "./collection.create.controller";
import { getByEnterprise } from "./collection.get.controller";
import { remove } from "./collection.delete.controller";

export const CollectionController = (service: CollectionService) => ({
    createController: create(service),
    getByEnterpriseController: getByEnterprise(service),
    deleteController: remove(service),
});