const PI_DECIMAL_PLACES = 12;

export function piDecimalForStorage(value: unknown): string {
  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!/^\d+(?:\.\d{1,12})?$/.test(normalized)) throw new Error('INVALID_PI_DECIMAL');
    return normalized;
  }
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('INVALID_PI_DECIMAL');
  return value.toFixed(PI_DECIMAL_PLACES);
}
