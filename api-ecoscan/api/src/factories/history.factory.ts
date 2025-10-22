import { pool } from "../database/connection";
import { createHistoryRepository } from "../database/repositories/history";
import { HistoryService } from "../services/history";

class HistoryFactoryInternal {
  private historyServiceInstance: HistoryService | null = null;

  getServiceInstance(): HistoryService {
    if (this.historyServiceInstance) {
      return this.historyServiceInstance;
    }

    const repository = createHistoryRepository(pool);
    const service = HistoryService(repository);
    this.historyServiceInstance = service;

    return service;
  }
}

export const HistoryFactory = new HistoryFactoryInternal();