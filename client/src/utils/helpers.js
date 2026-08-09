import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL || ''}${path}`;
}
