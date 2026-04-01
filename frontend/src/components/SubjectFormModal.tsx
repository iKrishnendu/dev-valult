import { useState, type FormEvent } from 'react'
import Modal from './Modal'

interface SubjectFormModalProps {
  initialName?: string
  title: string
  description: string
  submitLabel: string
  onClose: () => void
  onSubmit: (name: string) => Promise<void>
}

function SubjectFormModal({
  initialName = '',
  title,
  description,
  submitLabel,
  onClose,
  onSubmit,
}: SubjectFormModalProps) {
  const [name, setName] = useState(initialName)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(name.trim())
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={title} description={description} onClose={onClose}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Subject name
          </span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="React"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:border-emerald-400"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default SubjectFormModal
