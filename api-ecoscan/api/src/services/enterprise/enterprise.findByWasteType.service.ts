import type { EnterpriseRepository } from "../../database/repositories/enterprise";

export const findByWasteType =
  (repository: EnterpriseRepository) => async (wasteType: string) => {
    // Simplesmente chama o método do repositório
    const enterprises = await repository.findByWasteTypeRepository(wasteType);
    return enterprises;
  };