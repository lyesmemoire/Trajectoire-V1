// @ts-nocheck
import { Repository } from "./Repository";

/**
 * Contrat spécialisé pour la sauvegarde d'Aggregates.
 */
export interface AggregateRepository<TAggregate, TId = string> extends Repository<TAggregate, TId> {
  // Potential aggregate specific extensions if needed
}
