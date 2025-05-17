'use client'
import type { EvOptions, EvTarget } from '../../types'

import React from 'react'
import { useEventListener } from '../use-event-listener'

/**
 * @description
 * A hook that fires the given callback when clicked outside anywhere of the given html element.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-outside-click.html
 */
export default function useOutsideClick({
   target,
   handler,
   options,
}: {
   target: EvTarget
   handler?: (event: DocumentEventMap['click']) => void
   options?: EvOptions
}) {
   const eventCb = (event: DocumentEventMap['click']) => {
      const node = typeof target == 'function' ? target() : null // node which need to be tracked if click has occured within it or not

      if (!node) return

      if (event.target == node) return

      if ('contains' in node && (node as Node).contains(event.target as Node)) {
         return
      }
      handler?.(event)
   }

   useEventListener({
      target: () => document,
      event: 'click',
      handler: eventCb,
      options: {
         capture: true,
         ...options,
      },
   })
}
