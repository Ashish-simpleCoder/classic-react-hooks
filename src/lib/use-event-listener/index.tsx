import React, { useEffect } from 'react'
import useSyncedRef from '../use-synced-ref'

type Target = null | EventTarget | (() => EventTarget | null)
type Options = boolean | AddEventListenerOptions
type Handler = (event: Event) => void

/* Have taken reference from ChakraUI's use-event-listener for typing out the props in type-safe manner. */

/**
 * @description
 *  A hook for adding dom events in declarative manner.
 *  
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-event-listener
 *
 * @example
   import { useEventListener } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const ref = useRef()
      useEventListener(() => ref.current, 'click', (e) =>{
         console.log(e)
      })

      return (
         <div>
            <button ref={ref}>button</button>
         </div>
      )
   }
*/
export function useEventListener<K extends keyof DocumentEventMap>(
   target: Target,
   event: K,
   handler?: (event: DocumentEventMap[K]) => void,
   options?: Options,
   shouldInjectEvent?: boolean
): void
export function useEventListener<K extends keyof WindowEventMap>(
   target: Target,
   event: K,
   handler?: (event: WindowEventMap[K]) => void,
   options?: Options,
   shouldInjectEvent?: boolean
): void
export function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
   target: Target,
   event: K,
   handler?: (event: GlobalEventHandlersEventMap[K]) => void,
   options?: Options,
   shouldInjectEvent?: boolean
): void
export function useEventListener(
   target: Target,
   event: string,
   handler?: Handler,
   options?: Options,
   shouldInjectEvent: boolean = true
) {
   const listener = useSyncedRef({
      handler,
      options,
   })

   useEffect(() => {
      const node = typeof target === 'function' ? target() : target

      if (!listener.current.handler || !node) return

      const callback = (e: Event) => listener.current.handler?.(e)
      const options = listener.current.options

      if (shouldInjectEvent) {
         node.addEventListener(event, callback, options)
      }

      return () => {
         node.removeEventListener(event, callback, options)
      }
   }, [event, target, shouldInjectEvent])
}
