import { FiMoon, FiSun } from 'react-icons/fi'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
    >
      {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

export default ThemeToggle
