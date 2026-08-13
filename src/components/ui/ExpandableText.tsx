import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ExpandableTextProps {
  text: string
  /** Characters shown before truncating. */
  collapsedLength?: number
  className?: string
}

/**
 * Long-form text with a Read more / Read less toggle.
 *
 * Paragraph breaks in TMDB biographies and reviews are plain newlines, so they
 * are split into real paragraphs rather than collapsed into one block. The old
 * code called `.slice(0, 300)` directly on the field, which crashed whenever
 * the field was absent.
 */
export function ExpandableText({ text, collapsedLength = 600, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false)

  const needsToggle = text.length > collapsedLength
  const visible = expanded || !needsToggle ? text : `${text.slice(0, collapsedLength).trimEnd()}…`

  const paragraphs = visible.split(/\n{2,}|\r\n{2,}/).filter((p) => p.trim())

  return (
    <div className={className}>
      <div className="space-y-3 leading-relaxed text-fg/90">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className={cn(
            'mt-2 text-sm font-semibold text-brand transition-colors hover:text-fg',
          )}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}
