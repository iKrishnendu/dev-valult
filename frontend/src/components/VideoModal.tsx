import Modal from './Modal'

interface VideoModalProps {
  title: string
  embedUrl: string
  onClose: () => void
}

function VideoModal({ title, embedUrl, onClose }: VideoModalProps) {
  return (
    <Modal title={title} description="Previewing a YouTube resource inside DevVault." onClose={onClose}>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 dark:border-slate-700">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
    </Modal>
  )
}

export default VideoModal
