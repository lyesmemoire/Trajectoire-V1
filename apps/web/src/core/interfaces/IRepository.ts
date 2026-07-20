/**
 * IRepository Interface
 * Base interface for all repository implementations
 * Following Dependency Inversion Principle and Repository Pattern
 */

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
}

export interface IRepository<T> {
  /**
   * Find an entity by ID
   * @param id - Entity ID
   * @returns Entity or null if not found
   */
  findById(id: string): Promise<T | null>;

  /**
   * Find all entities matching criteria
   * @param criteria - Search criteria
   * @param options - Query options
   * @returns Array of entities
   */
  find(criteria: Partial<T>, options?: QueryOptions): Promise<T[]>;

  /**
   * Find one entity matching criteria
   * @param criteria - Search criteria
   * @returns Entity or null if not found
   */
  findOne(criteria: Partial<T>): Promise<T | null>;

  /**
   * Create a new entity
   * @param entity - Entity to create
   * @returns Created entity
   */
  create(entity: Omit<T, "id">): Promise<T>;

  /**
   * Update an entity
   * @param id - Entity ID
   * @param updates - Partial entity updates
   * @returns Updated entity
   */
  update(id: string, updates: Partial<T>): Promise<T>;

  /**
   * Delete an entity
   * @param id - Entity ID
   * @returns Whether deletion was successful
   */
  delete(id: string): Promise<boolean>;

  /**
   * Count entities matching criteria
   * @param criteria - Search criteria
   * @returns Count of entities
   */
  count(criteria?: Partial<T>): Promise<number>;
}
