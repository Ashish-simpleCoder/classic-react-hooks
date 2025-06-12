'use client'
import React, { useEffect, useRef } from 'react'

const DEFAULT_DELAY = 300

/**
 * @description
 *  A hook which returns a debounced function.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-debounced-fn.html
 *
 */
export default function useDebouncedFn<T extends (...args: any[]) => any>({
   callbackToBounce,
   delay,
}: {
   callbackToBounce: T
   delay?: number
}) {
   const paramsRef = useRef({
      callbackToBounce,
      delay,
   })

   // tracking props with immutable object
   paramsRef.current.delay = delay
   paramsRef.current.callbackToBounce = callbackToBounce

   // so can access the updated props inside debouncedFnWrapper function
   const debouncedCb = useRef(debouncedFnWrapper(paramsRef.current))

   useEffect(() => {
      return () => {
         debouncedCb.current.cleanup()
      }
   }, [delay])

   return debouncedCb.current.fn
}

/**
 * @description
 * A React hook that returns a debounced version of any function, delaying its execution until after a specified delay has passed since the last time it was invoked.
 * 
 * @example
   import { useState, useEffect } from 'react'
   import { useDebouncedFn } from 'classic-react-hooks'

   export default function SearchInput() {
      const [query, setQuery] = useState('')
      const [results, setResults] = useState([])

      const debouncedSearch = useDebouncedFn({
         callbackToBounce: async (searchTerm: string) => {
            if (searchTerm.trim()) {
               const response = await fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
               const data = await response.json()
               setResults(data.results)
            }
         },
         delay: 500,
      })

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const value = e.target.value
         setQuery(value)
         debouncedSearch(value)
      }

      useEffect(() => {
         ;(async function () {
            const response = await fetch(`https://dummyjson.com/users`)
            const data = await response.json()
            setResults(data.results)
         })()
      }, [])

      return (
         <div>
            <input value={query} onChange={handleInputChange} placeholder='Search products...' />
            <div>
               {results.map((result) => (
                  <div key={result.id}>{result.name}</div>
               ))}
            </div>
         </div>
      )
   }
 * 
 *  @see Docs https://classic-react-hooks.vercel.app/hooks/use-debounced-fn.html
 */
export function debouncedFnWrapper<T extends (...args: any[]) => any>(props: { callbackToBounce: T; delay?: number }) {
   let timerId: NodeJS.Timeout

   return {
      fn: (...args: Parameters<typeof props.callbackToBounce>) => {
         if (timerId) {
            clearTimeout(timerId)
         }
         timerId = setTimeout(() => {
            try {
               props.callbackToBounce.call(null, ...args)
            } catch (err) {
               throw err
            }
         }, props.delay ?? DEFAULT_DELAY)
      },
      cleanup: () => clearTimeout(timerId),
   }
}
