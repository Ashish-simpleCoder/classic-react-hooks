import React, { useRef } from 'react'

/**
 * @description
 * A replacement for `useRef` hook, which automatically synces up with the given state.
 * 
 * No need to manually update the ref.
 *  
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-synced-ref
 *
 * @example
   import { useState } from 'react'
   import { useSyncedRef } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const [counter, setCounter] = useState(0)

      const counterRef = useSyncedRef(counter)


      return (
         <div>
            <button onClick={() => setCounter(c => c+1)}>increment</button>
         </div>
      )
   }
*/
export default function useSyncedRef<T>(state: T) {
   const dataRef = useRef(state)
   dataRef.current = state
   return dataRef
}
