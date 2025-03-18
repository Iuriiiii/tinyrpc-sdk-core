import type { StreamableOptions } from "./interfaces/mod.ts";
import { Serializable, SerializableClass } from "@online/packager";

@Serializable()
export class Streamable extends SerializableClass {
  constructor(private readonly options: StreamableOptions) {
    super();
  }
}
