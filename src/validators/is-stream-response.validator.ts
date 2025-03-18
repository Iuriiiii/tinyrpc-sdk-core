export function isStreamResponse(response: Response) {
  return response.headers.get("Content-Type") === "application/octet-stream" &&
    response.headers.get("Transfer-Encoding") === "chunked";
}
