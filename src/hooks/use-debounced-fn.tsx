import { useCallback, useRef } from 'react'

export default function useDebouncedFn<T extends (...args: any[]) => any>(cb: T, delay = 300) {
   const paramsRef = useRef({ cb, delay })
   paramsRef.current.cb = cb
   paramsRef.current.delay = delay

   const debouncedCb = useCallback(() => debouncedFnWrapper(paramsRef.current.cb, paramsRef.current.delay), [])
   return debouncedCb
}

export function debouncedFnWrapper<T extends (...args: any[]) => any>(cb: T, delay: number = 300) {
   let timerId: NodeJS.Timeout

   return (...args: Parameters<typeof cb>) => {
      if (timerId) {
         clearTimeout(timerId)
      }
      timerId = setTimeout(() => cb.call(args), delay)
   }
}
