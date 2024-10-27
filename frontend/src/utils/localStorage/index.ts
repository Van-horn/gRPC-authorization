export const setItem = (key: string, payload: string): void => {
  localStorage.setItem(key, payload);
};
export const getItem = (key: string): string | null =>
  localStorage.getItem(key);
export const removeItem = (key: string): void => localStorage.removeItem(key);
