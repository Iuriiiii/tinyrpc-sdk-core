import type { PickMembers } from "./pick-members.type.ts";

export type ClassOrInterface<T> = T | PickMembers<T>;
