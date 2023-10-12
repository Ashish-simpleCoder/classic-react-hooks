import { useEffect, useRef } from 'react'

export default function useIntervalEffect(cb: () => void, delay = 0) {
   let paramsRef = useRef({ cb, delay })
   paramsRef.current.cb = cb
   paramsRef.current.delay = delay

   useEffect(() => {
      let timerId = setInterval(paramsRef.current.cb, paramsRef.current.delay)
      return () => {
         clearInterval(timerId)
      }
   }, [])
}
