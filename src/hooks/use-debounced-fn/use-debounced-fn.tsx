import { useCallback } from 'react'
import useSyncedRef from '../use-synced-ref/use-synced-ref'

export default function useDebouncedFn<T extends (...args: any[]) => any>(cb: T, delay = 300) {
   const paramsRef = useSyncedRef({ cb, delay })
   
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
