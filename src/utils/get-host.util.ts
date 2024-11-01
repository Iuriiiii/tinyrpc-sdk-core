export function getHost(value: string, https = false) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return "http" + (https ? "s" : "") + "://" + value;
}
