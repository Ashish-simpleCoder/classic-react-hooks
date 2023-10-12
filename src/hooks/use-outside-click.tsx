import { useCallback } from 'react'
import { useEventListener } from './use-event-listener'
import useSyncedRef from './use-synced-ref'

type Target = null | EventTarget | (() => EventTarget | null)

export default function useOutsideClick(
   target: Target,
   handler: (event: DocumentEventMap['click']) => void,
   shouldAddEvent = true
) {
   const paramsRef = useSyncedRef({ target, handler })

   const eventCb = useCallback((event: DocumentEventMap['click']) => {
      if (event.target == target) return
      const node = typeof target === 'function' ? target() : target ?? document
      if (node && (node as Node).contains(event.target as Node)) {
         return
      }
      paramsRef.current.handler(event)
   }, [])

   useEventListener(document, 'click', eventCb, undefined, shouldAddEvent)
}
