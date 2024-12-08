export type Unwrappable<T, K> = Promise<T> & {
  unwrap: () => Promise<K>;
};
