import type { EvOptions, EvTarget } from '../../types'

import React, { useRef, useState } from 'react'
import { useEventListener } from '../use-event-listener'

/**
 * @description
 * A React hook that detects outside click for specified element and triggers the given callback.
 *
 * @example
   import { useState } from 'react'
   import { useOutsideClick } from 'classic-react-hooks'

   function Modal() {
      const [isOpen, setIsOpen] = useState(false)

      const {setElementRef} = useOutsideClick({
         handler: () => setIsOpen(false),
      })

      if (!isOpen) {
         return <button onClick={() => setIsOpen(true)}>Open Modal</button>
      }

      return (
         <div className='modal-overlay'>
            <div ref={setElementRef} class='modal-content bg-white p-8 rounded-lg shadow-md'>
               <h2>Modal Title</h2>
               <p>Click outside this modal to close it.</p>
               <button onClick={() => setIsOpen(false)}>Close</button>
            </div>
         </div>
      )
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-outside-click.html
 */
export default function useOutsideClick({
   target,
   handler,
   options,
}: {
   target?: EvTarget
   handler?: (event: DocumentEventMap['click']) => void
   options?: EvOptions
}) {
   const [elementNode, setElementNode] = useState<EventTarget | null>(() =>
      typeof target === 'function' ? target() : null
   )
   const setElementRef = useRef((elementNode: HTMLElement | null) => {
      setElementNode(elementNode)
   })

   const eventCb = (event: DocumentEventMap['click']) => {
      const node = elementNode // node which need to be tracked if click has occured within it or not

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
         capture: false, // Fixing the event delegation, to prevent async event trigger in react
         ...options,
      },
   })

   return { setElementRef: setElementRef.current }
}
