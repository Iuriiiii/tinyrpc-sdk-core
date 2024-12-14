import type { InterfaceOf } from "./interface-of.type.ts";

export type ClassOrInterface<T> = T | InterfaceOf<T>;
