import { type RequestHandler, Router } from "express";
import {
  createEnterpriseSchema,
  enterpriseLoginSchema,
  idEnterpriseSchema,
  updateEnterpriseSchema,
} from "../dtos/enterprise.dto";
import { ParamsType } from "../enums/params.enum";
import { validador } from "../middlewares/validator.middleware";
import { EnterpriseFactory } from "../factories/enterprise.factory";
import { EnterpriseController } from "../controllers/enterprise";

export const enterpriseRoutes = Router();

const enterpriseController = EnterpriseController(
  EnterpriseFactory.getServiceInstance(),
);


enterpriseRoutes.get(
  "/search",
  enterpriseController.findEnterpriseByWasteTypeController as RequestHandler,
);

enterpriseRoutes.post(
  "/",
  validador({ schema: createEnterpriseSchema, type: ParamsType.BODY }),
  enterpriseController.createEnterpriseController as RequestHandler,
);


enterpriseRoutes.post(
  "/login",
  validador({ schema: enterpriseLoginSchema, type: ParamsType.BODY }),
  enterpriseController.loginEnterpriseController as RequestHandler,
);


enterpriseRoutes.get(
  "/:id",
  validador({ schema: idEnterpriseSchema, type: ParamsType.PARAMS }),
  enterpriseController.findByIdEnterpriseController as RequestHandler,
);

enterpriseRoutes.put(
  "/",
  validador({ schema: updateEnterpriseSchema, type: ParamsType.BODY }),
  enterpriseController.updateEnterpriseController as RequestHandler,
);


enterpriseRoutes.delete(
  "/:id",
  validador({ schema: idEnterpriseSchema, type: ParamsType.PARAMS }),
  enterpriseController.deleteEnterpriseController as RequestHandler,
);