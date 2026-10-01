import { useEffect } from 'react'
import { trackEvent } from './client'
import type { TitleMediaType } from '@/lib/tmdb/types'

/** Fires `view_title` once per loaded movie/TV detail page. */
export function useTrackTitleView(
  mediaType: TitleMediaType,
  id: number | undefined,
  name: string | undefined,
): void {
  useEffect(() => {
    if (id === undefined || !name) return
    trackEvent('view_title', { media_type: mediaType, item_id: id, item_name: name })
    // Keyed on identity only: a refetch of the same title isn't a new view.
  }, [mediaType, id])
}

/** Fires `view_person` once per loaded person page. */
export function useTrackPersonView(id: number | undefined, name: string | undefined): void {
  useEffect(() => {
    if (id === undefined || !name) return
    trackEvent('view_person', { item_id: id, item_name: name })
  }, [id])
}
