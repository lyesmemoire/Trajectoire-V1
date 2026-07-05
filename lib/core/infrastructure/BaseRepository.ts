import { Result } from "../result/Result";
import { DomainError } from "../result/errors/DomainError";
import { ok, fail } from "../result";
import { BaseMapper } from "./BaseMapper";

/**
 * AbstractRepository — classe abstraite agnostique de l'ORM.
 * 
 * Responsabilités :
 * - Standardiser la traduction d'erreurs (via handleError).
 * - Encapsuler les appels infrastructure dans des Result.
 * - Fournir un accès au mapper.
 * 
 * Elle ne connaît PAS Prisma, Supabase, Mongo, etc.
 * Ce sont les implémentations concrètes qui injectent l'ORM.
 */
export abstract class AbstractRepository<Persistence, Domain, Response> {
  constructor(protected mapper: BaseMapper<Persistence, Domain, Response>) {}

  /**
   * Traduit une erreur d'infrastructure en DomainError typée.
   * Chaque implémentation concrète doit fournir sa propre traduction
   * (ex: PrismaClientKnownRequestError → ConflictError, NotFoundError, etc.)
   */
  protected abstract handleError(error: unknown): DomainError;

  /**
   * Exécute une opération infrastructure et l'encapsule dans un Result.
   * En cas d'erreur, elle est traduite via handleError().
   */
  protected async safeExecute<T>(operation: () => Promise<T>): Promise<Result<T, DomainError>> {
    try {
      const result = await operation();
      return ok(result);
    } catch (error) {
      return fail(this.handleError(error));
    }
  }
}
