export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findMany(filters?: { limit?: number; orderBy?: { column: string; ascending?: boolean } }): Promise<T[]>;
  insert(payload: any): Promise<T>;
  update(id: string, payload: any): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export class FakeRepository<T extends { id: string }> implements Repository<T> {
  private items: Map<string, T> = new Map();

  async findById(id: string): Promise<T | null> {
    return this.items.get(id) || null;
  }

  async findMany(filters?: { limit?: number; orderBy?: { column: string; ascending?: boolean } }): Promise<T[]> {
    let results = Array.from(this.items.values());

    if (filters?.orderBy) {
      results = results.sort((a, b) => {
        const aVal = (a as any)[filters.orderBy!.column];
        const bVal = (b as any)[filters.orderBy!.column];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return filters.orderBy!.ascending !== false ? comparison : -comparison;
      });
    }

    if (filters?.limit) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }

  async insert(payload: any): Promise<T> {
    const item = { ...payload } as T;
    this.items.set(item.id, item);
    return item;
  }

  async update(id: string, payload: any): Promise<T> {
    const existing = this.items.get(id);
    if (!existing) {
      throw new Error(`Item with id ${id} not found`);
    }
    const updated = { ...existing, ...payload } as T;
    this.items.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.items.delete(id);
  }

  // Helper methods for testing
  clear(): void {
    this.items.clear();
  }

  setItems(items: T[]): void {
    this.items.clear();
    items.forEach(item => this.items.set(item.id, item));
  }

  count(): number {
    return this.items.size;
  }
}
