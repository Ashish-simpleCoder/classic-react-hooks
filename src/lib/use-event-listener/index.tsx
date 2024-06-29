'use client'
import type { Prettify } from '../../types'
import React, { RefObject, useEffect } from 'react'
import useSyncedRef from '../use-synced-ref'

export type Target = null | EventTarget | RefObject<EventTarget> | (() => EventTarget | null)
export type Options = boolean | Prettify<AddEventListenerOptions & { shouldInjectEvent?: boolean | any }>
export type Handler = (event: Event) => void

/* Have taken reference from ChakraUI's use-event-listener for typing out the props in type-safe manner. */

/**
 * @description
 *  A hook which handles dom events in efficient and declarative manner.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-event-listener.html
 */
export function useEventListener<K extends keyof DocumentEventMap>(
   target: Target,
   event: K,
   handler?: (event: DocumentEventMap[K]) => void,
   options?: Options
): void
export function useEventListener<K extends keyof WindowEventMap>(
   target: Target,
   event: K,
   handler?: (event: WindowEventMap[K]) => void,
   options?: Options
): void
export function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
   target: Target,
   event: K,
   handler?: (event: GlobalEventHandlersEventMap[K]) => void,
   options?: Options
): void
export function useEventListener(target: Target, event: string, handler?: Handler, options?: Options) {
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
