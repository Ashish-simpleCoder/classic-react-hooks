import { useEffect } from 'react'
import useSyncedRef from '../use-synced-ref/use-synced-ref'

export default function useTimeoutEffect(cb: () => void, delay = 0) {
   let paramsRef = useSyncedRef({ cb, delay })

   useEffect(() => {
      let timerId = setTimeout(paramsRef.current.cb, paramsRef.current.delay)
      return () => {
         clearTimeout(timerId)
      }
   }, [])
}
