import React, { useEffect, useRef } from 'react'
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
   const cleanupCallbackRef = useRef<(e: Event) => void>()

   useEffect(() => {
      const node = typeof target === 'function' ? target() : target

      if (!listener.current.handler || !node) return

      const callback = (e: Event) => listener.current.handler?.(e)
      const options = listener.current.options
      cleanupCallbackRef.current = callback

      if (shouldAddEvent) {
         node.addEventListener(event, callback, options)
      } else {
         node.removeEventListener(event, callback, options)
      }

      return () => {
         node.removeEventListener(event, callback, options)
      }
   }, [event, target, shouldAddEvent])

   // cleanup function
   return () => {
      const node = typeof target === 'function' ? target() : target
      if (!cleanupCallbackRef.current || !node) return

      node.removeEventListener(event, cleanupCallbackRef.current, listener.current.options)
   }
}
