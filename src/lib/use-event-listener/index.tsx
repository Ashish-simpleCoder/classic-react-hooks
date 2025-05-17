'use client'
import type { EvHandler, EvOptions, EvTarget } from '../../types'

import React, { useEffect, useState } from 'react'
import useSyncedRef from '../use-synced-ref'

/* Have taken reference from ChakraUI's use-event-listener for typing out the props in type-safe manner. */

/**
 * @description
 *  A hook which handles dom events in efficient and declarative manner.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-event-listener.html
 */
export function useEventListener<K extends keyof DocumentEventMap>({
   target,
   event,
   handler,
   options,
}: {
   target: EvTarget
   event: K
   handler?: (event: DocumentEventMap[K]) => void
   options?: EvOptions
}): void
export function useEventListener<K extends keyof WindowEventMap>({
   target,
   event,
   handler,
   options,
}: {
   target: EvTarget
   event: K
   handler?: (event: WindowEventMap[K]) => void
   options?: EvOptions
}): void
export function useEventListener<K extends keyof GlobalEventHandlersEventMap>({
   target,
   event,
   handler,
   options,
}: {
   target: EvTarget
   event: K
   handler?: (event: GlobalEventHandlersEventMap[K]) => void
   options?: EvOptions
}): void
export function useEventListener({
   target,
   event,
   handler,
   options,
}: {
   target: EvTarget
   event: string
   handler?: EvHandler
   options?: EvOptions
}) {
   const [elementNode, setElementNode] = useState<EventTarget | null>(() =>
      typeof target === 'function' ? target() : null
   )

   const listener = useSyncedRef({
      handler,
      options,
      effectCb: () => {
         if (!shouldInjectEvent || !listener.current.handler || !elementNode) return

         const callback = (e: Event) => listener.current.handler?.(e)
         elementNode.addEventListener(event, callback, listener.current.options)

         return () => {
            elementNode.removeEventListener(event, callback, listener.current.options)
         }
      },
   })
   let shouldInjectEvent = true,
      capture,
      once,
      passive,
      signal

   if (typeof options == 'object') {
      if ('shouldInjectEvent' in options) {
         shouldInjectEvent = !!options.shouldInjectEvent
      }
      capture = options.capture
      once = options.once
      passive = options.passive
      signal = options.signal
   }

   useEffect(() => {
      setElementNode(typeof target === 'function' ? target() : null)
   }, [target])

   useEffect(listener.current.effectCb, [elementNode, event, shouldInjectEvent, capture, once, passive, signal])
}
