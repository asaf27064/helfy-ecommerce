export default function EmptyState({ icon = '✦', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl text-primary-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {subtitle && <p className="mt-1 max-w-sm text-sm text-slate-400">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
