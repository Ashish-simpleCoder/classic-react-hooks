import { useEffect, useRef } from 'react'

export default function useSyncedEffect(cb: () => void, dep: [] = []) {
   const isInitialLoad = useRef(true)
   useEffect(() => {
      let cleanup
      if (isInitialLoad) {
         isInitialLoad.current = false
      } else {
         cleanup = cb()
      }
      return cleanup
   }, dep)
}
