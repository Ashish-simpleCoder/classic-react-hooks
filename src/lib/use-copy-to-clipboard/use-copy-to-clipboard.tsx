import React, { useRef } from 'react'
import useSyncedRef from '../use-synced-ref/use-synced-ref'

type OnSuccess = () => void
type OnError = (err: Error) => void
type CopyToClipboard = (data: string, onSuccess?: OnSuccess, onError?: OnError) => void

export default function useCopyToClipboard(props?: { onSuccess?: OnSuccess; onError?: OnError }): CopyToClipboard {
   const propsRef = useSyncedRef(props)

   const copyToClipboard = useRef((data: string, onSuccess?: OnSuccess, onError?: OnError) => {
      try {
         if (navigator.clipboard) {
            navigator.clipboard
               .writeText(data)
               .then(() => onSuccess?.() || propsRef.current?.onSuccess?.())
               .catch((error) => onError?.(error) || propsRef.current?.onError?.(error))
         }
      } catch (error) {
         console.error(error)
         onError?.(error as Error) || propsRef.current?.onError?.(error as Error)
      }
   })

   return copyToClipboard.current
}
