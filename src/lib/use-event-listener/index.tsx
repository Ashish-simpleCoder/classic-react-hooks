'use client'
import type { EvHandler, EvOptions, EvTarget } from '../../types'

import React, { useEffect, useLayoutEffect, useState } from 'react'
import useSyncedRef from '../use-synced-ref'

/* Have taken reference from ChakraUI's use-event-listener for typing out the props in type-safe manner. */

/**
 * @description
 *  A React hook that provides a declarative way to add DOM event listeners with automatic cleanup.
 *
 * @example
   import { useRef } from 'react'
   import { useEventListener } from 'classic-react-hooks'

   export default function ClickExample() {
      const buttonRef = useRef<HTMLButtonElement>(null)

      useEventListener({
         target: () => buttonRef.current,
         event: 'click',
         handler: (e) => {
            console.log('Button clicked!', e)
         },
      })

      return <button ref={buttonRef}>Click me</button>
   }
 * 
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-event-listener.html
 */
export function useEventListener<K extends keyof DocumentEventMap>({
   target,
   event,
   handler,
   options,
   layoutEffect,
}: {
   target: EvTarget
   event: K
   handler?: (event: DocumentEventMap[K]) => void
   options?: EvOptions
   layoutEffect?: boolean
}): void
export function useEventListener<K extends keyof WindowEventMap>({
   target,
   event,
   handler,
   options,
   layoutEffect,
}: {
   target: EvTarget
   event: K
   handler?: (event: WindowEventMap[K]) => void
   options?: EvOptions
   layoutEffect?: boolean
}): void
export function useEventListener<K extends keyof GlobalEventHandlersEventMap>({
   target,
   event,
   handler,
   options,
   layoutEffect,
}: {
   target: EvTarget
   event: K
   handler?: (event: GlobalEventHandlersEventMap[K]) => void
   options?: EvOptions
   layoutEffect?: boolean
}): void
export function useEventListener({
   target,
   event,
   handler,
   options,
   layoutEffect,
}: {
   target: EvTarget
   event: string
   handler?: EvHandler
   options?: EvOptions
   layoutEffect?: boolean
}) {
   // Determining which hook to use -> layout or effect
   const useSelectedHook = layoutEffect ? useLayoutEffect : useEffect

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

   useSelectedHook(() => {
      setElementNode(typeof target === 'function' ? target() : null)
   }, [target])

   useSelectedHook(listener.current.effectCb, [elementNode, event, shouldInjectEvent, capture, once, passive, signal])
}
