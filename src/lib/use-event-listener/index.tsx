'use client'
import type { EventTypes } from '../../types'

import React, { useEffect } from 'react'
import useSyncedRef from '../use-synced-ref'


/* Have taken reference from ChakraUI's use-event-listener for typing out the props in type-safe manner. */

/**
 * @description
 *  A hook which handles dom events in efficient and declarative manner.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-event-listener.html
 */
export function useEventListener<K extends keyof DocumentEventMap>(
   target: EventTypes['Target'],
   event: K,
   handler?: (event: DocumentEventMap[K]) => void,
   options?: EventTypes['Options']
): void
export function useEventListener<K extends keyof WindowEventMap>(
   target: EventTypes['Target'],
   event: K,
   handler?: (event: WindowEventMap[K]) => void,
   options?: EventTypes['Options']
): void
export function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
   target: EventTypes['Target'],
   event: K,
   handler?: (event: GlobalEventHandlersEventMap[K]) => void,
   options?: EventTypes['Options']
): void
export function useEventListener(target: EventTypes['Target'], event: string, handler?: EventTypes['Handler'], options?: EventTypes['Options']) {
   const listener = useSyncedRef({
      handler,
      options,
   })
   let shouldInjectEvent = true
   if (typeof options == 'object' && 'shouldInjectEvent' in options) {
      shouldInjectEvent = !!options.shouldInjectEvent
   }

   useEffect(() => {
      const node = typeof target === 'function' ? target() : target

      if (!listener.current.handler || !node) return

      const callback = (e: Event) => listener.current.handler?.(e)
      const options = listener.current.options

      if (shouldInjectEvent) {
         if ('current' in node) {
            node.current?.addEventListener(event, callback, options)
         } else {
            node.addEventListener(event, callback, options)
         }
      }

      return () => {
         if ('current' in node) {
            node.current?.removeEventListener(event, callback, options)
         } else {
            node.removeEventListener(event, callback, options)
         }
      }
   }, [event, target, shouldInjectEvent])
}
