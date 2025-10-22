import { Router } from "express";
import { baseRoutes } from "./base.route";
import { enterpriseRoutes } from "./enterprise.route";
import { usersRoutes } from "./users.route";
import { authRoute } from "./auth.route";
import { historyRoutes } from "./history.route"
import { analyzeRoute } from "./analyze.route";
import { collectionRoutes } from "./collection.route"; 

export const routes = Router();
routes.use("/", baseRoutes);
routes.use("/auth", authRoute);
routes.use("/enterprise", enterpriseRoutes);
routes.use("/", usersRoutes);
routes.use("/", historyRoutes);
routes.use("/api", analyzeRoute);
routes.use("/", collectionRoutes); 