'use client'
import React, { useSyncExternalStore } from 'react'

/**
 * @description
 * A simple hook for getting the network connection state.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-is-online.html
 */
export default function useIsOnline() {
   return useSyncExternalStore(subscribe, getSnapshot, () => true)
}

function subscribe(callback: () => void) {
   window.addEventListener('online', callback)
   window.addEventListener('offline', callback)

   return () => {
      window.addEventListener('online', callback)
      window.addEventListener('offline', callback)
   }
}
const getSnapshot = () => navigator.onLine
