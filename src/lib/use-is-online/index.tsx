import React, { useSyncExternalStore } from 'react'

/**
 * @description
 * A simple hook for getting the network connection state.
 *  
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-is-online
 *
 * @example
   import { useIsOnline } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const isOnline = useIsOnline()

      return (
         <div>
            {isOnline ? "online" : "offline"}
         </div>
      )
   }
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
