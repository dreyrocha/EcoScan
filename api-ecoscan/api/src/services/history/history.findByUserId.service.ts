import type { HistoryRepository } from "../../database/repositories/history";
import type { ScanHistory } from "../../database/repositories/history/history.findByUserId.repository";

export const findByUserId =
  (historyRepository: HistoryRepository) =>
  async (id_user: string): Promise<ScanHistory[]> => {
    const history = await historyRepository.findHistoryByUserIdRepository(id_user);
    return history;
  };