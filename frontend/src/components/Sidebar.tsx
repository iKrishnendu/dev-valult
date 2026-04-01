import { FiBookOpen, FiFolderPlus, FiLayers, FiStar } from 'react-icons/fi'
import type { SubjectSummary } from '../types'

interface SidebarProps {
  subjects: SubjectSummary[]
  activeSubjectId: string | null
  onSelect: (id: string) => void
  onCreateSubject: () => void
}

function Sidebar({ subjects, activeSubjectId, onSelect, onCreateSubject }: SidebarProps) {
  return (
    <aside className="glass-panel flex h-full flex-col rounded-[28px] p-5">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
          <FiBookOpen size={14} />
          DevVault
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">
          Personal developer knowledge hub
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Keep docs, tutorials, articles, and interview prep in one focused workspace.
        </p>
      </div>

      <button
        type="button"
        onClick={onCreateSubject}
        className="mb-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
      >
        <FiFolderPlus size={16} />
        Add subject
      </button>

      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
        <span>Subjects</span>
        <span>{subjects.length}</span>
      </div>

      <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto pr-1">
        {subjects.map((subject) => {
          const isActive = subject._id === activeSubjectId

          return (
            <button
              key={subject._id}
              type="button"
              onClick={() => onSelect(subject._id)}
              className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                isActive
                  ? 'border-emerald-400/50 bg-emerald-500/10 text-slate-950 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-white'
                  : 'border-slate-200/70 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/30 dark:text-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div className="font-display text-lg font-semibold">{subject.name}</div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-2.5 py-1 dark:bg-white/5">
                  <FiLayers size={12} />
                  {subject.stats.categoryCount} categories
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-2.5 py-1 dark:bg-white/5">
                  <FiBookOpen size={12} />
                  {subject.stats.resourceCount} resources
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/5 px-2.5 py-1 dark:bg-white/5">
                  <FiStar size={12} />
                  {subject.stats.bookmarkCount} starred
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
