import { Router, type RequestHandler } from "express";
import { CollectionFactory } from "../factories/collection.factory";
import { CollectionController } from "../controllers/collections";

export const collectionRoutes = Router();
const controller = CollectionController(CollectionFactory.getServiceInstance());

collectionRoutes.get("/collections/:enterpriseId", controller.getByEnterpriseController as RequestHandler);
collectionRoutes.post("/collections", controller.createController as RequestHandler);
collectionRoutes.delete("/collections/:collectionId", controller.deleteController as RequestHandler);