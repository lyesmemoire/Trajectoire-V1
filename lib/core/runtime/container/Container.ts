export class Container {
  private singletons = new Map<string, any>();
  private transients = new Map<string, () => any>();

  registerSingleton<T>(key: string, instance: T): void {
    this.singletons.set(key, instance);
  }

  registerTransient<T>(key: string, factory: () => T): void {
    this.transients.set(key, factory);
  }

  resolve<T>(key: string): T {
    if (this.singletons.has(key)) {
      return this.singletons.get(key) as T;
    }
    if (this.transients.has(key)) {
      const factory = this.transients.get(key)!;
      return factory() as T;
    }
    throw new Error(`Dependency not found for key: ${key}`);
  }
}
