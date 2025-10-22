import type { HistoryRepository } from "../../database/repositories/history";

export const create =
  (historyRepository: HistoryRepository) =>
  async (
    id_user: string,
    material_type: string,
    confidence: number
    
  ): Promise<void> => {
    await historyRepository.createHistoryRepository(
      id_user,
      material_type,
      confidence
   
    );
  };