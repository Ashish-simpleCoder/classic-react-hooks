import type { DependencyList } from 'react'
import { useEffect, useRef } from 'react'

const DEP: DependencyList = []

export default function useSyncedEffect(cb: () => void, dep: DependencyList | undefined) {
   const isInitialLoad = useRef(true)
   
   useEffect(() => {
      let cleanup
      if (isInitialLoad) {
         isInitialLoad.current = false
      } else {
         cleanup = cb()
      }
      return cleanup
   }, dep ?? DEP)
}
