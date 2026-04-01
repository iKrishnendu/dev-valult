interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="glass-panel rounded-3xl border-dashed p-8 text-center">
      <h3 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default EmptyState
