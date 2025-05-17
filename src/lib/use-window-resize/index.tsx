'use client'
import { useState } from 'react'
import { useEventListener } from '../use-event-listener'

/**
 * @description
 * A hook which evaluates the passed callback on window resize event and returns the result of that callback.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-window-resize.html
 */
export default function useWindowResize<T>({
   handler,
   options,
}: {
   handler: () => T
   options?: { defaultValue?: T; shouldInjectEvent?: boolean }
}) {
   const [result, setResult] = useState(options?.defaultValue ?? handler)

   useEventListener({
      target: () => window,
      event: 'resize',
      handler: () => setResult(handler),
      options: {
         shouldInjectEvent: options?.shouldInjectEvent ?? true,
      },
   })
   return result
}
