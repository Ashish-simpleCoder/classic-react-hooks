import type { DependencyList, EffectCallback } from 'react'
import React, { useEffect, useRef } from 'react'

const DEP: DependencyList = []

/**
 * @description
 * A hooks that fires the given callback for given dependencies.
 * 
 * It works exacatly like `useEffect`. But callback doesn't get fired on initial mount.
 * 
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-synced-effect
 *
 * @example
   import { useState } from 'react'
   import { useSyncedEffect } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const [counter, setCounter] = useState(0)

      useSyncedEffect(() => {
         console.log("counter changed to ", counter)
      }, [counter])


      return (
         <div>
            <button onClick={() => setCounter(c => c+1)}>increment</button>
         </div>
      )
   }
*/
export default function useSyncedEffect(cb: EffectCallback, deps?: DependencyList) {
   const isInitialLoad = useRef(true)
   const cleanup = useRef<void | (() => void)>()

   useEffect(() => {
      if (isInitialLoad.current) {
         isInitialLoad.current = false
      } else {
         cleanup.current = cb()
      }
      return cleanup.current
   }, deps ?? DEP)
}
