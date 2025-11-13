import React, { useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

type OnSuccess = () => void
type OnError = (err: Error) => void
type CopyToClipboardFn = (data: string, onSuccess?: OnSuccess, onError?: OnError) => Promise<void>

/**
 * @description
 * A React hook that provides simple and reliable way to copy text to the clipboard with success and error handling callbacks.
 *
 * @example
   import { useState } from 'react'
   import { useCopyToClipboard } from 'classic-react-hooks'

   export default function CopyButton() {
      const [copied, setCopied] = useState(false)

      const copyToClipboard = useCopyToClipboard({
         onSuccess: () => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
         },
         onError: (error) => {
            console.error('Failed to copy:', error)
         },
      })

      const handleCopy = () => {
         copyToClipboard('Hello, World!')
      }

      return <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Text'}</button>
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-copy-to-clipboard.html
 *
 */
export default function useCopyToClipboard(props?: { onSuccess?: OnSuccess; onError?: OnError }): CopyToClipboardFn {
   const propsRef = useSyncedRef(props)

   const copyToClipboard = useRef(async (data: string, onSuccess?: OnSuccess, onError?: OnError) => {
      copyToClipboardFn(data, onSuccess || propsRef.current?.onSuccess, onError || propsRef.current?.onError)
   })

   return copyToClipboard.current
}

/**
 *
 * @example
   copyToClipboardFn(
      'Text to copy',
      () => console.log('Copied successfully!'),
      (error) => console.error('Copy failed:', error)
   )
 *
 */
export async function copyToClipboardFn(data: string, onSuccess?: OnSuccess, onError?: OnError) {
   try {
      if (navigator.clipboard) {
         navigator.clipboard
            .writeText(data)
            .then(() => onSuccess?.())
            .catch((error) => onError?.(error))
      } else {
         const error: Partial<Error> = {
            message: 'Cliboard not available',
         }
         onError?.(error as Error)
      }
   } catch (error) {
      onError?.(error as Error)
   }
}
