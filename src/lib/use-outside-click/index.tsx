import type { EvOptions, EvTarget } from '../../types'

import React, { useEffect, useRef } from 'react'
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
         return <button onClick={(e) => {
            e.stopPropagation()
            setIsOpen(true)
         }}>Open Modal</button>
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
   const elementNode = useRef<HTMLElement | undefined | null>()
   const setElementRef = useRef((node: HTMLElement | null) => {
      elementNode.current = node
   })
   const mergedOptions: EvOptions = { shouldInjectEvent: true, ...options }

   const eventCb = (event: DocumentEventMap['click']) => {
      const node = elementNode.current // node which need to be tracked if click has occured within it or not

      if (!node) {
         console.warn('Provided target element is null. Skipping the document click handler.')
         return
      }
      if (event.target == node) return

      if ('contains' in node && (node as Node).contains(event.target as Node)) {
         return
      }
      handler?.(event)
   }

   useEffect(() => {
      // Setting target inside effect, because effects run after the rendering of dom is done.
      // Lazily setting target when <shouldInjectEvent> prop is true
      if (typeof target == 'function' && mergedOptions.shouldInjectEvent) {
         setElementRef.current(target() as HTMLElement)
      }
   }, [target, options?.shouldInjectEvent])

   useEventListener({
      target: () => document,
      event: 'click',
      handler: eventCb,
      options: {
         capture: false, // Let the event bubble from top-to-bottom. Prevent it from user side using e.stopPropagation() on the button click
         ...options,
      },
   })

   return { setElementRef: setElementRef.current }
}
