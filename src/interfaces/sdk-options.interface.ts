import type { DeserializeFunction, SerializerFunction } from "@online/miniserializer";

export interface SdkOptions {
  host: string;
  https: boolean;
  serializers: SerializerFunction[];
  deserializers: DeserializeFunction[];
}
