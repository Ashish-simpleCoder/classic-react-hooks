'use client'
import React, { useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

type OnSuccess = () => void
type OnError = (err: Error) => void
type CopyToClipboardFn = (data: string, onSuccess?: OnSuccess, onError?: OnError) => Promise<void>

/**
 * @description
 *  A hook for copying the data in the clipboard with success and error callbacks.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-copy-to-clipboard.html
 *
 */
export default function useCopyToClipboard(props?: { onSuccess?: OnSuccess; onError?: OnError }): CopyToClipboardFn {
   const propsRef = useSyncedRef(props)

   const copyToClipboard = useRef(async (data: string, onSuccess?: OnSuccess, onError?: OnError) => {
      try {
         if (navigator.clipboard) {
            navigator.clipboard
               .writeText(data)
               .then(() => (onSuccess || propsRef.current?.onSuccess)?.())
               .catch((error) => (onError || propsRef.current?.onError)?.(error))
         } else {
            const error: Partial<Error> = {
               message: 'Cliboard not available',
            }
            ;(onError || propsRef.current?.onError)?.(error as Error)
         }
      } catch (error) {
         ;(onError || propsRef.current?.onError)?.(error as Error)
      }
   })

   return copyToClipboard.current
}
