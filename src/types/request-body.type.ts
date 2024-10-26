export type RequestBody = Omit<RequestInit, "method" | "headers" | "body">;
