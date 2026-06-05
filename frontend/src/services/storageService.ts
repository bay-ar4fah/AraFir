export function saveData<T>(
  key: string,
  data: T
): void {
  localStorage.setItem(
    key,
    JSON.stringify(data)
  );
}

export function loadData<T>(
  key: string,
  fallback: T
): T {

  const raw =
    localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}