import { Badge } from '@/components/ui/Badge'
import { ExternalLinkIcon } from '@/components/ui/icons'
import { logoUrl } from '@/lib/tmdb/images'
import { formatCurrency } from '@/lib/utils/format'
import type { ExternalIds, Keyword, Network, SpokenLanguage } from '@/lib/tmdb/types'

export interface Fact {
  label: string
  value: string | null | undefined
}

export interface FactsSidebarProps {
  facts: Fact[]
  keywords: Keyword[]
  externalIds?: ExternalIds | undefined
  homepage?: string | null
  languages?: SpokenLanguage[] | undefined
  networks?: Network[] | undefined
  budget?: number | null
  revenue?: number | null
}

/**
 * Right-hand facts rail.
 *
 * Replaces Right.jsx, which wrote to context during render (`setLanguage(...)`
 * inside the component body) and duplicated every field for the movie and TV
 * cases.
 */
export function FactsSidebar({
  facts,
  keywords,
  externalIds,
  homepage,
  languages,
  networks,
  budget,
  revenue,
}: FactsSidebarProps) {
  const socials = [
    externalIds?.imdb_id && {
      label: 'IMDb',
      href: `https://www.imdb.com/title/${externalIds.imdb_id}/`,
    },
    externalIds?.twitter_id && {
      label: 'X',
      href: `https://x.com/${externalIds.twitter_id}`,
    },
    externalIds?.instagram_id && {
      label: 'Instagram',
      href: `https://instagram.com/${externalIds.instagram_id}`,
    },
    externalIds?.facebook_id && {
      label: 'Facebook',
      href: `https://facebook.com/${externalIds.facebook_id}`,
    },
  ].filter((link): link is { label: string; href: string } => Boolean(link))

  return (
    <aside className="space-y-6 text-sm">
      {(socials.length > 0 || homepage) && (
        <div className="flex flex-wrap items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-border"
            >
              {social.label}
              <ExternalLinkIcon size={12} />
            </a>
          ))}
          {homepage && (
            <a
              href={homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-surface-2 px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-border"
            >
              Website
              <ExternalLinkIcon size={12} />
            </a>
          )}
        </div>
      )}

      <dl className="space-y-4">
        {facts
          .filter((fact) => fact.value)
          .map((fact) => (
            <div key={fact.label}>
              <dt className="font-bold">{fact.label}</dt>
              <dd className="text-muted">{fact.value}</dd>
            </div>
          ))}

        {typeof budget === 'number' && formatCurrency(budget) && (
          <div>
            <dt className="font-bold">Budget</dt>
            <dd className="text-muted">{formatCurrency(budget)}</dd>
          </div>
        )}

        {typeof revenue === 'number' && formatCurrency(revenue) && (
          <div>
            <dt className="font-bold">Revenue</dt>
            <dd className="text-muted">{formatCurrency(revenue)}</dd>
          </div>
        )}

        {languages && languages.length > 0 && (
          <div>
            <dt className="font-bold">Spoken Languages</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {languages.map((language) => (
                <Badge key={language.iso_639_1} variant="muted">
                  {language.english_name || language.name}
                </Badge>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {networks && networks.length > 0 && (
        <div>
          <h2 className="font-bold">Networks</h2>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {networks.map((network) =>
              network.logo_path ? (
                <img
                  key={network.id}
                  src={logoUrl(network.logo_path, 'w92') ?? undefined}
                  alt={network.name}
                  title={network.name}
                  loading="lazy"
                  // Network logos are usually dark-on-transparent, so they need
                  // inverting in dark mode to stay visible.
                  className="h-6 w-auto object-contain dark:brightness-0 dark:invert"
                />
              ) : (
                <Badge key={network.id} variant="muted">
                  {network.name}
                </Badge>
              ),
            )}
          </div>
        </div>
      )}

      {keywords.length > 0 && (
        <div>
          <h2 className="font-bold">Keywords</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {keywords.map((keyword) => (
              <Badge key={keyword.id} to={`/keyword/${keyword.id}`} variant="muted">
                {keyword.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
