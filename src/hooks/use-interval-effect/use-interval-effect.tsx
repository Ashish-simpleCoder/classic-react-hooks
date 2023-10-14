import { useCallback, useEffect, useRef } from 'react'
import useSyncedRef from '../use-synced-ref/use-synced-ref'

export default function useIntervalEffect(cb: () => void, delay = 0) {
   let paramsRef = useSyncedRef({ cb, delay })
   const intervalId = useRef<NodeJS.Timeout>()

   const clearTimer = useCallback(() => {
      clearInterval(intervalId.current)
   }, [])

   const restartTimer = useCallback(() => {
      clearTimer()
      intervalId.current = setInterval(paramsRef.current.cb, paramsRef.current.delay)
   }, [])

   useEffect(() => {
      intervalId.current = setInterval(paramsRef.current.cb, paramsRef.current.delay)
      return clearTimer
   }, [])

   return { clearTimer, restartTimer }
}
