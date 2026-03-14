import type { EvHandler, EvOptions, EvTarget, UseEventListenerReturnValues } from '../../types'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import useSyncedRef from '../use-synced-ref'

/* Have taken reference from ChakraUI's use-event-listener for typing out the props in type-safe manner. */

/**
 * @description
 *  A React hook that makes it easy to attach DOM event listeners declaratively with automatic cleanup.
 *
 * @example
   import { useEventListener } from 'classic-react-hooks'

   export default function ClickExample() {

      const {setElementRef} = useEventListener({
         event: 'click',
         handler: (e) => {
            console.log('Button clicked!', e)
         },
      })

      return <button ref={setElementRef}>Click me</button>
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
   target?: EvTarget
   event: K
   handler?: (event: DocumentEventMap[K]) => void
   options?: EvOptions
   layoutEffect?: boolean
}): UseEventListenerReturnValues
export function useEventListener<K extends keyof WindowEventMap>({
   target,
   event,
   handler,
   options,
   layoutEffect,
}: {
   target?: EvTarget
   event: K
   handler?: (event: WindowEventMap[K]) => void
   options?: EvOptions
   layoutEffect?: boolean
}): UseEventListenerReturnValues
export function useEventListener<K extends keyof GlobalEventHandlersEventMap>({
   target,
   event,
   handler,
   options,
   layoutEffect,
}: {
   target?: EvTarget
   event: K
   handler?: (event: GlobalEventHandlersEventMap[K]) => void
   options?: EvOptions
   layoutEffect?: boolean
}): UseEventListenerReturnValues
export function useEventListener({
   target,
   event,
   handler,
   options,
   layoutEffect,
}: {
   target?: EvTarget
   event: string
   handler?: EvHandler
   options?: EvOptions
   layoutEffect?: boolean
}) {
   // Determining which hook to use -> layout or effect
   const useSelectedHook = layoutEffect ? useLayoutEffect : useEffect

   const [elementNode, setElementNode] = useState<EventTarget | null>(null)

   const setElementRef = useRef((elementNode: HTMLElement | null) => {
      setElementNode(elementNode)
   })

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
      if (typeof target == 'function' && shouldInjectEvent) {
         setElementRef.current(target() as HTMLElement)
      }
   }, [target, shouldInjectEvent])

   useSelectedHook(listener.current.effectCb, [elementNode, event, shouldInjectEvent, capture, once, passive, signal])

   return { setElementRef: setElementRef.current }
}
