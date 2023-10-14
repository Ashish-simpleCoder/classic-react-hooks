import type { DependencyList, EffectCallback } from 'react'
import { useEffect, useRef } from 'react'

const DEP: DependencyList = []


export default function useSyncedEffect(cb: EffectCallback, dep: DependencyList | undefined) {
   const isInitialLoad = useRef(true)
   const cleanup = useRef<(void | (() => void))>()

   useEffect(() => {
      if (isInitialLoad.current) {
         isInitialLoad.current = false
      } else {
         cleanup.current = cb()
      }
      return cleanup.current
   }, dep ?? DEP)
}
