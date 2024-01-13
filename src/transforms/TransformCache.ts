export class TransformCache {
  private static cache_: Map<string, unknown> = new Map();

  static get(key: string): unknown {
    const value = this.cache_.get(key);

    if (value) {
      // eslint-disable-next-line no-console
      console.log(`Cache hit for ${key}`);
    }

    return value;
  }
  static add(key: string, value: unknown) {
    this.cache_.set(key, value);

    // Max of 1000 items in the cache
    if (this.cache_.size > 1000) {
      const firstKey = this.cache_.keys().next().value;

      this.cache_.delete(firstKey);
    }
  }
}
