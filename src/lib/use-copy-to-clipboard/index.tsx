import React, { useRef } from 'react'
import useSyncedRef from '../use-synced-ref'

type OnSuccess = () => void
type OnError = (err: Error) => void
type CopyToClipboardFn = (data: string, onSuccess?: OnSuccess, onError?: OnError) => Promise<void>

/**
 * @description
 *  A hook for copying the data in the clipboard with success and error callbacks.
 *  
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-copy-to-clipboard
 *
 * @example
   import { useState } from 'react'
   import { useCopyToClipboard } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const [data, setData] = useState('')
      const copyToClipboard = useCopyToClipboard()


      return (
         <div>
            <input
               placeholder='enter data to copy'
               value={data}
               onChange={(e) => setData(e.target.value)}
            />
            <button
               onClick={() =>
                  copyToClipboard(
                     data,
                     () => console.log('success'),
                     (err) => console.log(err)
                  )
               }
            >
               copy
            </button>
         </div>
      )
   }
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
