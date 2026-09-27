const isBrowser = typeof window !== 'undefined';
const envUrl = import.meta.env.PUBLIC_API_URL;

export const API_BASE_URL = (
  envUrl !== undefined && envUrl !== ''
    ? envUrl
    : isBrowser
      ? ''
      : `http://localhost:${process.env.PORT || 4321}`
).replace(/\/+$/, '');
