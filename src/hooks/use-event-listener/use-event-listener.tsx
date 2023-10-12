import { useEffect } from 'react'
import useSyncedRef from '../use-synced-ref/use-synced-ref'

type Target = null | EventTarget | (() => EventTarget | null)
type Options = boolean | AddEventListenerOptions

export function useEventListener<K extends keyof DocumentEventMap>(
   target: Target,
   event: K,
   handler?: (event: DocumentEventMap[K]) => void,
   options?: Options,
   shouldAddEvent?: boolean
): VoidFunction
export function useEventListener<K extends keyof WindowEventMap>(
   target: Target,
   event: K,
   handler?: (event: WindowEventMap[K]) => void,
   options?: Options,
   shouldAddEvent?: boolean
): VoidFunction
export function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
   target: Target,
   event: K,
   handler?: (event: GlobalEventHandlersEventMap[K]) => void,
   options?: Options,
   shouldAddEvent?: boolean
): VoidFunction
export function useEventListener(
   target: Target,
   event: string,
   handler: ((event: Event) => void) | undefined,
   options?: Options,
   shouldAddEvent: boolean = true
) {
   const listener = useSyncedRef({ handler, options })

   useEffect(() => {
      const node = typeof target === 'function' ? target() : target ?? document

      if (!listener.current.handler || !node) return

      if (shouldAddEvent) {
         node.addEventListener(event, listener.current.handler, listener.current.options)
      } else {
         node.removeEventListener(event, listener.current.handler, listener.current.options)
      }

      return () => {
         if (!listener.current.handler) return
         node.removeEventListener(event, listener.current.handler, listener.current.options)
      }
   }, [event, target, shouldAddEvent])

   return () => {
      const node = typeof target === 'function' ? target() : target ?? document
      if (!listener.current.handler) return
      node?.removeEventListener(event, listener.current.handler, listener.current.options)
   }
}
