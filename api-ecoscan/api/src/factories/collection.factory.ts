import { pool } from "../database/connection";
import { createCollectionRepository } from "../database/repositories/collections";
import { CollectionService } from "../services/collections";

class CollectionFactoryInternal {
  private serviceInstance: CollectionService | null = null;

  getServiceInstance(): CollectionService {
    if (this.serviceInstance) {
      return this.serviceInstance;
    }
    const repository = createCollectionRepository(pool);
    const service = CollectionService(repository);
    this.serviceInstance = service;
    return service;
  }
}

export const CollectionFactory = new CollectionFactoryInternal();