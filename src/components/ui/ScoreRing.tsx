import { toPercent } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'

export interface ScoreRingProps {
  /** TMDB `vote_average` on a 0-10 scale. */
  voteAverage: number | null | undefined
  size?: number
  className?: string
  /** Hides the ring entirely when there are no votes yet. */
  hideWhenEmpty?: boolean
}

function scoreColor(percent: number): string {
  if (percent >= 70) return 'rgb(var(--color-success))'
  if (percent >= 40) return 'rgb(var(--color-warning))'
  return 'rgb(var(--color-danger))'
}

/**
 * TMDB-style circular user-score meter.
 *
 * Rendered as a single SVG with a stroke-dashoffset arc — no per-frame JS and
 * no layout cost. The old UI showed the raw float (`7.412`) as plain text.
 */
export function ScoreRing({
  voteAverage,
  size = 40,
  className,
  hideWhenEmpty = false,
}: ScoreRingProps) {
  const percent = toPercent(voteAverage)
  const hasScore = percent > 0

  if (!hasScore && hideWhenEmpty) return null

  const stroke = Math.max(2, Math.round(size * 0.085))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - percent / 100)
  const color = scoreColor(percent)

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full bg-navy',
        className,
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={hasScore ? `User score: ${percent} percent` : 'No user score yet'}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeOpacity={0.25}
          strokeWidth={stroke}
        />
        {hasScore && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        )}
      </svg>

      <span
        className="absolute font-semibold leading-none text-white"
        style={{ fontSize: Math.max(9, Math.round(size * 0.3)) }}
      >
        {hasScore ? (
          <>
            {percent}
            <span style={{ fontSize: '0.6em', verticalAlign: 'super' }}>%</span>
          </>
        ) : (
          'NR'
        )}
      </span>
    </div>
  )
}
