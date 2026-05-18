export function removeNullUndefined(obj: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(obj).filter(([_key, v]) => v != null));
}
