export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  const set = (v) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-800">
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        className="px-3 py-2 text-lg text-slate-300 transition-colors hover:text-white disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-semibold text-white">{value}</span>
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        className="px-3 py-2 text-lg text-slate-300 transition-colors hover:text-white disabled:opacity-40"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
