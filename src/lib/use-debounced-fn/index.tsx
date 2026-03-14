import React, { useEffect, useRef } from 'react'

const DEFAULT_DELAY = 300

/**
 * @description
 *
 * use-debounced-fn is an async-aware React hook that provides a powerful, declarative way to implement debouncing with full lifecycle control.
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
   callbackToBounce: (signal: AbortSignal, ...args: any[]) => void
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
   callbackToBounce: (signal: AbortSignal, ev: Ev, ...args: Args) => any
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
   callbackToBounce: (signal: AbortSignal, ...args: any[]) => any
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
   immediateCallback?: (...args: Parameters<T>) => void
   callbackToBounce: (signal: AbortSignal, ...args: Parameters<T>) => any
   onSuccess?: (...args: Parameters<T>) => void
   onError?: (error: Error, ...args: Parameters<T>) => void
   onFinally?: (...args: Parameters<T>) => void
   delay?: number
}) {
   let timerId: ReturnType<typeof setTimeout>
   let controller: AbortController | null = null

   return {
      debouncedFn: (...args: Parameters<T>) => {
         // Immediate phase
         props.immediateCallback?.(...args)

         // Cancel previous async work
         controller?.abort()

         if (timerId) clearTimeout(timerId)

         controller = new AbortController()

         timerId = setTimeout(async () => {
            try {
               await props.callbackToBounce.call(null, controller!.signal, ...args)
               props.onSuccess?.(...args)
            } catch (err) {
               if ((err as DOMException).name !== 'AbortError') {
                  props.onError?.(err as Error, ...args)
               }
            } finally {
               props.onFinally?.(...args)
            }
         }, props.delay ?? DEFAULT_DELAY)
      },

      cleanup: () => {
         controller?.abort()
         clearTimeout(timerId)
      },
   }
}
