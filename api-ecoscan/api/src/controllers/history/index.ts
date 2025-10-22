import type { HistoryService } from "../../services/history";
import { create } from "./history.create.controller";
import { get } from "./history.get.controller";

export const HistoryController = (historyService: HistoryService) => ({
  createHistoryController: create(historyService),
  getHistoryController: get(historyService),
});