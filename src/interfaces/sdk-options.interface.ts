import type { DeserializeFunction, SerializerFunction } from "@online/packager";

export interface SdkOptions {
  host: string;
  https: boolean;
  serializers: SerializerFunction[];
  deserializers: DeserializeFunction[];
}
