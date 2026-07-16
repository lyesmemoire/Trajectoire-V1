// @ts-nocheck
import { Result } from "@/lib/core/result";

/**
 * Interface générique pour un Repository standard.
 * - getById : échoue (fail) si l'entité n'existe pas.
 * - save : sauvegarde ou met à jour.
 * - delete : supprime.
 */
export interface Repository<TEntity, TId = string> {
  getById(id: TId): Promise<Result<TEntity>>;
  save(entity: TEntity): Promise<Result<void>>;
  delete(id: TId): Promise<Result<void>>;
}

/**
 * Contrat spécialisé pour la sauvegarde d'Aggregates.
 */
export interface AggregateRepository<TAggregate, TId = string> extends Repository<TAggregate, TId> {
  // Potential aggregate specific extensions if needed
}
