import { formatCurrency } from '../../lib/formatters';

export default function Price({ value, className = '' }) {
  return <span className={className}>{formatCurrency(value)}</span>;
}
