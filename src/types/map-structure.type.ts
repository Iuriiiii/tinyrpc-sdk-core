export type MapStructure<K extends object> =
  (keyof K | Partial<{ [key in keyof K]: MapStructure<K> }>)[];
