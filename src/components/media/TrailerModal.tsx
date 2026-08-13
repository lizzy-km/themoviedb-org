import { Modal } from '@/components/ui/Modal'
import { youTubeEmbedUrl } from '@/lib/tmdb/images'
import type { Video } from '@/lib/tmdb/types'

export interface TrailerModalProps {
  video: Video | null
  onClose: () => void
}

/**
 * Lightbox for a YouTube trailer.
 *
 * The iframe is only mounted while open, so no YouTube script or player is
 * loaded until the user actually asks for the trailer.
 */
export function TrailerModal({ video, onClose }: TrailerModalProps) {
  return (
    <Modal open={Boolean(video)} onClose={onClose} title={video?.name ?? 'Trailer'} size="video">
      {video && (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <iframe
            src={youTubeEmbedUrl(video.key)}
            title={video.name}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
    </Modal>
  )
}
