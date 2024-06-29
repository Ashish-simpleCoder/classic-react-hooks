'use client'
import React, { useRef } from 'react'

/**
 * @description
 * A replacement for `useRef` hook, which automatically synces up with the given state.
 *
 * No need to manually update the ref.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-synced-ref.html
 */
export default function useSyncedRef<T>(state: T) {
   const dataRef = useRef(state)
   dataRef.current = state
   return dataRef
}
