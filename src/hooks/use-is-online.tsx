import { useSyncExternalStore } from 'react'

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
