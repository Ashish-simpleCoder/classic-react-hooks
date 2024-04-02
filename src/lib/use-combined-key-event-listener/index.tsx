import React, { useRef } from 'react'
import { useEventListener } from '../use-event-listener'

type Options = AddEventListenerOptions & {
   preventDefault?: boolean
   shouldAddEvent?: boolean
}

export default function useCombinedKeyEventListener<K extends keyof GlobalEventHandlersEventMap>(
   type: K,
   keys: string[],
   handler: (event: GlobalEventHandlersEventMap[K]) => void,
   options?: boolean | Options
) {
   const pressedKeysMap = useRef<Array<string>>([])
   let shouldInjectEvent: boolean | undefined = true
   let eventOptions: Options = {}

   if (options && options instanceof Object && !Array.isArray(options)) {
      const { shouldAddEvent, ...restOptions } = options
      eventOptions = restOptions
      shouldInjectEvent = shouldAddEvent
   }

   const listener = (event: GlobalEventHandlersEventMap[K]) => {
      if ('key' in event) {
         event.ctrlKey && pressedKeysMap.current.push('Control')
         event.shiftKey && pressedKeysMap.current.push('Shift')
         event.altKey && pressedKeysMap.current.push('Alt')

         !pressedKeysMap.current.includes(event.key) && pressedKeysMap.current.push(event.key)

         if (keys.toString() == pressedKeysMap.current.toString()) {
            if (eventOptions?.preventDefault) event.preventDefault()
            handler(event)
         }
      }
   }

   const clearPressedKey = () => {
      pressedKeysMap.current.pop()
   }

   useEventListener(document, type, listener, eventOptions, shouldInjectEvent)

   useEventListener(document, 'keyup', clearPressedKey, eventOptions, shouldInjectEvent)
   useEventListener(window, 'blur', () => (pressedKeysMap.current = []), shouldInjectEvent)
   useEventListener(window, 'contextmenu', () => (pressedKeysMap.current = []), shouldInjectEvent)
}
