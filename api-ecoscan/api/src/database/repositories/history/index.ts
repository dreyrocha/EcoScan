import type { Pool } from "pg";
import { create } from './history.creat.repository';
import { findByUserId } from "./history.findByUserId.repository";

export const createHistoryRepository = (pool: Pool) => {
  return {
    createHistoryRepository: create(pool),
    findHistoryByUserIdRepository: findByUserId(pool),
  };
};

export type HistoryRepository = ReturnType<typeof createHistoryRepository>;