import { useCallback, useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref/use-synced-ref'

export default function useTimeoutEffect(cb: () => void, delay = 0) {
   let paramsRef = useSyncedRef({ cb, delay })
   const timeoutId = useRef<NodeJS.Timeout>()

   const clearTimer = useCallback(() => {
      clearInterval(timeoutId.current)
   }, [])

   const restartTimer = useCallback(() => {
      clearTimer()
      timeoutId.current = setInterval(paramsRef.current.cb, paramsRef.current.delay)
   }, [])

   useEffect(() => {
      timeoutId.current = setTimeout(paramsRef.current.cb, paramsRef.current.delay)
      return clearTimer
   }, [])

   return { clearTimer, restartTimer }
}
