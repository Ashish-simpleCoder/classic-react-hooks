'use client'
import React, { useRef } from 'react'

/**
 * @description
 *  A React hook that creates a ref that automatically stays in sync with the provided value.
 *
 * @example
   import { useState } from 'react'
   import { useSyncedRef } from 'classic-react-hooks'

   export default function Counter() {
      const [count, setCount] = useState(0)
      const countRef = useSyncedRef(count)

      const handleAsyncOperation = () => {
         setTimeout(() => {
            // countRef.current always has the latest value
            console.log('Current count:', countRef.current)
            alert(`Count is now: ${countRef.current}`)
         }, 2000)
      }

      return (
         <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount((c) => c + 1)}>Increment</button>
            <button onClick={handleAsyncOperation}>Show count after 2 seconds</button>
         </div>
      )
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-synced-ref.html
 */
export default function useSyncedRef<T>(state: T) {
   const dataRef = useRef(state)
   dataRef.current = state
   return dataRef
}
