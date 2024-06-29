'use client'
import type { Target } from '../use-event-listener'
import React, { useCallback } from 'react'
import { useEventListener } from '../use-event-listener'
import useSyncedRef from '../use-synced-ref'

/**
 * @description
 * A hook that fires the given callback when clicked outside anywhere of the given html element.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-outside-click.html
 */
export default function useOutsideClick(
   target: Target,
   handler: (event: DocumentEventMap['click']) => void,
   options?: { shouldInjectEvent?: boolean | any }
) {
   const paramsRef = useSyncedRef({
      target,
      handler,
   })
   let shouldInjectEvent = true
   if (typeof options == 'object' && 'shouldInjectEvent' in options) {
      shouldInjectEvent = !!options.shouldInjectEvent
   }

   const eventCb = useCallback((event: DocumentEventMap['click']) => {
      const node = (typeof target == 'function' ? target() : target) ?? document
      if (event.target == node || ('current' in node && event.target == node.current)) return

      if (
         node &&
         (('contains' in node && (node as Node).contains(event.target as Node)) ||
            ('current' in node && 'contains' && (node.current as Node).contains(event.target as Node)))
      ) {
         return
      }
      paramsRef.current.handler(event)
   }, [])

   useEventListener(document, 'click', eventCb, { shouldInjectEvent: shouldInjectEvent })
}
