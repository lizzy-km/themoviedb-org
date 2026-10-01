import type * as FirebaseFirestore from 'firebase/firestore'
import { getFirebaseApp } from './app'
import { libraryKey, onLibraryChange, useLibraryStore } from '@/stores/libraryStore'
import type { LibraryChange, LibraryList, LibraryMap } from '@/stores/libraryStore'

/**
 * Mirrors the local library to Firestore for the signed-in user, so favorites
 * and watchlist follow the account across devices.
 *
 * Layout: `users/{uid}/library/{favorites|watchlist}` → `{ items: { "movie:603": entry } }`.
 * One document per list keeps a full sync to a single read, and per-item
 * merge writes mean two devices editing different titles never clobber
 * each other.
 *
 * The local Zustand store stays the source of truth for rendering; this
 * module only pushes local changes up and applies server snapshots down.
 */

const LISTS: readonly LibraryList[] = ['favorites', 'watchlist']

/**
 * Which account the locally persisted library belongs to. Set as soon as
 * sync starts, so sign-out always clears an account's titles from this
 * browser, even if the server was never reached.
 */
const OWNER_KEY = 'library-owner'

/**
 * Set to the uid while a guest library still has to be merged into that
 * account. Cleared once the first server snapshot is merged; until then every
 * start merges instead of letting the server copy replace local titles.
 */
const MERGE_PENDING_KEY = 'library-merge-pending'

function readKey(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeKey(key: string, value: string | null): void {
  try {
    if (value) localStorage.setItem(key, value)
    else localStorage.removeItem(key)
  } catch {
    /* Storage blocked — worst case a guest library is merged twice (idempotent). */
  }
}

type FirestoreModule = typeof FirebaseFirestore

async function getDb(): Promise<{ mod: FirestoreModule; db: FirebaseFirestore.Firestore } | null> {
  const [app, mod] = await Promise.all([getFirebaseApp(), import('firebase/firestore')])
  if (!app) return null
  return { mod, db: mod.getFirestore(app) }
}

function listRef(mod: FirestoreModule, db: FirebaseFirestore.Firestore, uid: string, list: LibraryList) {
  return mod.doc(db, 'users', uid, 'library', list)
}

/**
 * Changes are coalesced per list and written together: Firestore sustains
 * roughly one write per second per document, so a 500-title TMDB import (or
 * fast clicking) must not become 500 writes to the same doc.
 */
const FLUSH_DELAY_MS = 400

let stopCurrent: (() => void) | null = null
let flushCurrent: (() => Promise<void>) | null = null

/**
 * Changes made before the sync is attached. On page load the session and
 * Firestore take a moment to come up; without this, a title saved in that
 * window would be overwritten by the first server snapshot. Captured from app
 * start and replayed by `startLibrarySync`; discarded once the visitor turns
 * out to be a guest (their changes are already in local storage).
 */
let capturing = true
const earlyChanges: LibraryChange[] = []
onLibraryChange((change) => {
  if (capturing) earlyChanges.push(change)
})

/** Starts syncing for `uid`, replacing any previous sync. */
export async function startLibrarySync(uid: string): Promise<void> {
  stopLibrarySync()
  capturing = true

  const handle = await getDb().catch(() => null)
  if (!handle) {
    capturing = false
    earlyChanges.length = 0
    return
  }
  const { mod, db } = handle

  let stopped = false
  const cleanups: Array<() => void> = []

  // Local → server. Imports from TMDB (`origin: 'tmdb'`) go up too; only
  // server snapshots are applied via `replaceList`, which emits nothing.
  const pending: Record<LibraryList, Record<string, unknown>> = { favorites: {}, watchlist: {} }
  let timer: ReturnType<typeof setTimeout> | null = null

  const flush = async (): Promise<void> => {
    if (timer) clearTimeout(timer)
    timer = null
    const writes = LISTS.filter((list) => Object.keys(pending[list]).length > 0).map((list) => {
      const items = pending[list]
      pending[list] = {}
      return mod
        .setDoc(
          listRef(mod, db, uid, list),
          { items, updatedAt: mod.serverTimestamp() },
          { merge: true },
        )
        .catch((error) => console.error('[librarySync] write failed', error))
    })
    await Promise.all(writes)
  }

  cleanups.push(
    onLibraryChange((change) => {
      const key = libraryKey(change.entry.mediaType, change.entry.id)
      // Last change per key wins, so add-then-remove inside the window nets out.
      pending[change.list][key] = change.type === 'add' ? change.entry : mod.deleteField()
      timer ??= setTimeout(() => void flush(), FLUSH_DELAY_MS)
    }),
  )

  // Replay anything saved before this point and write it *before* listening:
  // Firestore applies local writes to its cache immediately, so every
  // snapshot (including the first) already includes them.
  capturing = false
  for (const change of earlyChanges.splice(0)) {
    const key = libraryKey(change.entry.mediaType, change.entry.id)
    pending[change.list][key] = change.type === 'add' ? change.entry : mod.deleteField()
  }
  void flush()

  flushCurrent = flush
  stopCurrent = () => {
    stopped = true
    // Send what's queued rather than dropping the user's last clicks.
    void flush()
    cleanups.forEach((fn) => fn())
  }

  const owner = readKey(OWNER_KEY)
  const mergePending = readKey(MERGE_PENDING_KEY) === uid || owner !== uid
  if (mergePending) writeKey(MERGE_PENDING_KEY, uid)
  writeKey(OWNER_KEY, uid)
  const merged = new Set<LibraryList>()

  // Server → local.
  for (const list of LISTS) {
    const ref = listRef(mod, db, uid, list)
    let first = true

    const unsubscribe = mod.onSnapshot(
      ref,
      (snapshot) => {
        if (stopped) return
        const remote = (snapshot.data()?.items ?? {}) as LibraryMap

        if (first && mergePending) {
          // First sign-in on this device: keep what the guest saved and push
          // anything the account doesn't have yet.
          const local = useLibraryStore.getState()[list]
          const localOnly = Object.entries(local).filter(([key]) => !(key in remote))
          if (localOnly.length > 0) {
            void mod
              .setDoc(
                ref,
                { items: Object.fromEntries(localOnly), updatedAt: mod.serverTimestamp() },
                { merge: true },
              )
              .catch((error) => console.error('[librarySync] merge failed', error))
          }
          useLibraryStore.getState().replaceList(list, { ...remote, ...Object.fromEntries(localOnly) })
        } else {
          useLibraryStore.getState().replaceList(list, remote)
        }

        // Only now is the guest library safely in the account.
        if (first && mergePending) {
          merged.add(list)
          if (merged.size === LISTS.length) writeKey(MERGE_PENDING_KEY, null)
        }
        first = false
      },
      (error) => console.error('[librarySync] snapshot failed', error),
    )
    cleanups.push(unsubscribe)
  }
}

export function stopLibrarySync(): void {
  stopCurrent?.()
  stopCurrent = null
  flushCurrent = null
}

/** Writes queued changes now. Await before signing out, while writes are still allowed. */
export async function flushLibrarySync(): Promise<void> {
  await flushCurrent?.()
}

/**
 * Called on sign-out: the local copy belonged to the account, so it must not
 * linger for whoever uses this browser next. A guest's library (no owner)
 * is left alone.
 */
export function releaseLocalLibrary(): void {
  stopLibrarySync()
  // Signed out (or a guest): nothing to replay.
  capturing = false
  earlyChanges.length = 0
  if (readKey(OWNER_KEY) === null) return
  useLibraryStore.getState().reset()
  writeKey(OWNER_KEY, null)
  writeKey(MERGE_PENDING_KEY, null)
}

/**
 * Deletes the user's synced library. Must run while the user is still signed
 * in. Best effort: a failure here must not block deleting the account itself
 * (the data is unreachable once the uid is gone). For guaranteed cleanup, add
 * the Firebase "Delete User Data" extension on the server.
 */
export async function deleteCloudLibrary(uid: string): Promise<void> {
  const handle = await getDb().catch(() => null)
  if (!handle) return
  const { mod, db } = handle
  stopLibrarySync()
  const results = await Promise.allSettled(
    LISTS.map((list) => mod.deleteDoc(listRef(mod, db, uid, list))),
  )
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[librarySync] could not delete cloud library', result.reason)
    }
  }
}
