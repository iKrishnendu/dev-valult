import { useEffect, type PropsWithChildren } from 'react'
import { FiX } from 'react-icons/fi'

interface ModalProps extends PropsWithChildren {
  title: string
  description?: string
  onClose: () => void
}

function Modal({ title, description, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-xl rounded-3xl p-6 text-slate-900 dark:text-white">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold">{title}</h2>
            {description ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Modal
