import React, { useCallback } from 'react'
import useSyncedRef from '../use-synced-ref'

const DEFAULT_DELAY = 300

/**
 * @description
 *  A hook which returns a debounced function.
 *  
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-debounced-fn
 *
 * @example
   import { useState } from 'react'
   import { useDebouncedFn } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const [debouncedInput, setDebouncedInput] = useState('')
      const updateInput = useDebouncedFn((e: ChangeEvent<HTMLInputElement>) => {
         setDebouncedInput(e.target.value)
      },300)

      return (
         <div>
            <input
               onChange={updateInput}
               placeholder='type something...'
            />
            <p>
               value - <span>{debouncedInput}</span>
            </p>
         </div>
      )
   }
*/
export default function useDebouncedFn<T extends (...args: any[]) => any>(cb: T, delay = DEFAULT_DELAY) {
   const paramsRef = useSyncedRef({
      cb,
      delay,
   })

   const debouncedCb = useCallback(debouncedFnWrapper(paramsRef.current.cb, paramsRef.current.delay), [])
   return debouncedCb
}

/**
 * @description
 *  A wrapper function which is used internally in `useDebouncedFn` hook.
 */
export function debouncedFnWrapper<T extends (...args: any[]) => any>(cb: T, delay = DEFAULT_DELAY) {
   let timerId: NodeJS.Timeout
   return (...args: Parameters<typeof cb>) => {
      if (timerId) {
         clearTimeout(timerId)
      }
      timerId = setTimeout(() => cb.call(null, ...args), delay)
   }
}
