'use client'
import React, { useRef } from 'react'

const DEFAULT_DELAY = 300

/**
 * @description
 *  A React hook that returns a throttled version of a callback function.
 *
 * @example 
   import { useState } from 'react'
   import { useThrottledFn } from 'classic-react-hooks'

   export default function AutoSave() {
      const [content, setContent] = useState('')
      const [saving, setSaving] = useState(false)

      const saveContent = useThrottledFn({
         callbackToThrottle: async (text) => {
            setSaving(true)
            try {
               await saveToAPI(text)
               console.log('Content saved!')
            } catch (error) {
               console.error('Save failed:', error)
            } finally {
               setSaving(false)
            }
         },
         delay: 2000, // Auto-save every 2 seconds at most
      })

      const handleChange = (e) => {
         const newContent = e.target.value
         setContent(newContent)
         saveContent(newContent)
      }

      return (
         <div>
            <textarea value={content} onChange={handleChange} placeholder='Type your content...' />
            {saving && <p>Saving...</p>}
         </div>
      )
   } 
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-throttled-fn.html
 *
 */
export default function useThrottledFn<T extends (...args: any[]) => any>({
   callbackToThrottle,
   delay,
}: {
   callbackToThrottle: T
   delay?: number
}) {
   const paramsRef = useRef({
      callbackToThrottle,
      delay,
   })

   // tracking props with immutable object
   paramsRef.current.delay = delay
   paramsRef.current.callbackToThrottle = callbackToThrottle

   // so can access the updated props inside debouncedFnWrapper function
   const throttledCb = useRef(throttledFnWrapper(paramsRef.current))

   return throttledCb.current
}

/**
 * @description
 *  A wrapper function which is used internally in `useThrottledFn` hook.
 */
export function throttledFnWrapper<T extends (...args: any[]) => any>(props: {
   callbackToThrottle: T
   delay?: number
}) {
   let lastExecutionTime = 0

   return function (...args: Parameters<typeof props.callbackToThrottle>) {
      const currentTime = Date.now()

      if (currentTime - lastExecutionTime >= (props.delay ?? DEFAULT_DELAY)) {
         try {
            // @ts-expect-error -> making "this" as "any" type working
            props.callbackToThrottle.call(this, ...args)
         } catch (err) {
            throw err
         } finally {
            lastExecutionTime = currentTime
         }
      }
   }
}
