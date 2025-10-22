import type { HistoryRepository } from "../../database/repositories/history";
import { create } from "./history.create.service";
import { findByUserId } from "./history.findByUserId.service";

export const HistoryService = (historyRepository: HistoryRepository) => ({
  createHistoryService: create(historyRepository),
  findHistoryByUserIdService: findByUserId(historyRepository),
});

export type HistoryService = ReturnType<typeof HistoryService>;