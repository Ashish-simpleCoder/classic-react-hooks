import React, { useEffect, useRef } from 'react'

const DEFAULT_DELAY = 300

/**
 * @description
 *  A React hook that returns a debounced version of any function, delaying its execution until after a specified delay has passed since the last time it was invoked.
 *
 * @example
 *
   import React, { useState, useEffect } from 'react'
   import { useDebouncedFn } from 'classic-react-hooks'

   export default function SearchInput() {
      const [query, setQuery] = useState('')
      const [results, setResults] = useState([])

      const { debouncedFn:debouncedSearch } = useDebouncedFn<string>({
         immediateCallback: (searchTerm) =>{
            setQuery(searchTerm)
         },
         callbackToBounce: async (searchTerm) => {
            if (searchTerm.trim()) {
               const url = "https://dummyjson.com/users/search?q="+searchTerm
               const response = await fetch(url)
               const data = await response.json()
               setResults(data.results)
            }
         },
         onSuccess: (searchTerm) => {
            console.log('Search successful')
         },
         onError: (error, searchTerm) => {
            console.error(error)
         },
         onFinally: (searchTerm) => {
            console.log('Search completed')
         },
         delay: 500,
      })

      useEffect(() => {
         ;(async function () {
            const response = await fetch(`https://dummyjson.com/users`)
            const data = await response.json()
            setResults(data.results)
         })()
      }, [])

      return (
         <div>
            <input value={query} onChange={(e) => debouncedSearch(e.target.value)} placeholder='Search products...' />
            <div>
               {results.map((result) => (
                  <div key={result.id}>{result.name}</div>
               ))}
            </div>
         </div>
      )
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-debounced-fn.html
 *
 */
export function useDebouncedFn({
   immediateCallback,
   callbackToBounce,
   onSuccess,
   onError,
   onFinally,
   delay,
}: {
   immediateCallback?: (...args: any[]) => void
   callbackToBounce: (...args: any[]) => void
   onSuccess?: (...args: any[]) => void
   onError?: (error: Error, ...args: any[]) => void
   onFinally?: (...args: any[]) => void
   delay?: number
}): {
   debouncedFn: (...args: any[]) => void
   cleanup: () => void
}
export function useDebouncedFn<Ev, Args extends any[] = any[]>({
   immediateCallback,
   callbackToBounce,
   onSuccess,
   delay,
}: {
   immediateCallback?: (ev: Ev, ...args: Args) => void
   callbackToBounce: (ev: Ev, ...args: Args) => void
   onSuccess?: (ev: Ev, ...args: Args) => void
   onError?: (error: Error, ev: Ev, ...args: Args) => void
   onFinally?: (ev: Ev, ...args: Args) => void
   delay?: number
}): {
   debouncedFn: (ev: Ev, ...args: Args) => void
   cleanup: () => void
}
export function useDebouncedFn({
   immediateCallback,
   callbackToBounce,
   onSuccess,
   onError,
   onFinally,
   delay,
}: {
   immediateCallback?: (...args: any[]) => void
   callbackToBounce: (...args: any[]) => void
   onSuccess?: (...args: any[]) => void
   onError?: (error: Error, ...args: any[]) => void
   onFinally?: (...args: any[]) => void
   delay?: number
}) {
   const paramsRef = useRef({
      immediateCallback,
      callbackToBounce,
      onSuccess,
      onError,
      onFinally,
      delay,
   })

   // tracking props with immutable object
   paramsRef.current.delay = delay
   paramsRef.current.callbackToBounce = callbackToBounce
   paramsRef.current.immediateCallback = immediateCallback
   paramsRef.current.onSuccess = onSuccess
   paramsRef.current.onError = onError
   paramsRef.current.onFinally = onFinally

   // so can access the updated props inside debouncedFnWrapper function
   const debouncedCb = useRef(debouncedFnWrapper(paramsRef.current))

   useEffect(() => {
      return () => {
         debouncedCb.current.cleanup()
      }
   }, [delay])

   return debouncedCb.current
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
export function debouncedFnWrapper<T extends (...args: any[]) => any>(props: {
   immediateCallback?: T
   callbackToBounce: T
   onError?: (error: Error, ...args: Parameters<typeof props.callbackToBounce>) => void
   onSuccess?: T
   onFinally?: T
   delay?: number
}) {
   let timerId: NodeJS.Timeout

   return {
      debouncedFn: (...args: Parameters<typeof props.callbackToBounce>) => {
         props.immediateCallback?.(...args)
         if (timerId) {
            clearTimeout(timerId)
         }
         timerId = setTimeout(() => {
            try {
               const res = props.callbackToBounce.call(null, ...args)
               if (res instanceof Promise) {
                  res.then(() => props.onSuccess?.(...args))
               } else {
                  props.onSuccess?.(...args)
               }
            } catch (err) {
               props.onError?.(err as Error, ...args)
            } finally {
               props.onFinally?.(...args)
            }
         }, props.delay ?? DEFAULT_DELAY)
      },
      cleanup: () => clearTimeout(timerId),
   }
}
