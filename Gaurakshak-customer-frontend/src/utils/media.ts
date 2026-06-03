import { API_BASE_URL } from '@/constants/siteConfig';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export const getMediaUrl = (url?: string, fallback = '') => {
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};
