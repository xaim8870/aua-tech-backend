export const requireEnv = (key: string, value: string | undefined): string => {
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};