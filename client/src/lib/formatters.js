export function formatCurrency(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function titleCase(str = '') {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
