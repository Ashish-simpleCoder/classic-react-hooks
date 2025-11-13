import { useState } from 'react'
import { useEventListener } from '../use-event-listener'

/**
 * @description
 * A React hook that evaluates provided callback function on window resize event and returns the result of it.
 *
 * @example
   import { useWindowResize } from 'classic-react-hooks'

   function ResponsiveComponent() {
      const breakpoint = useWindowResize(() => {
         const width = window.innerWidth
         if (width < 640) return 'sm'
         if (width < 768) return 'md'
         if (width < 1024) return 'lg'
         return 'xl'
      })

      return (
         <div>
            <h1>Current breakpoint: {breakpoint}</h1>
            {breakpoint === 'sm' && <MobileLayout />}
            {breakpoint === 'md' && <TabletLayout />}
            {['lg', 'xl'].includes(breakpoint) && <DesktopLayout />}
         </div>
      )
   }
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
      layoutEffect: true,
   })
   return result
}
