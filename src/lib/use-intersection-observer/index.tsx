import type { Prettify } from '../../types'

import { useEffect, useRef, useState } from 'react'
import { capitalizeFirstLetter } from '../../utils/capitalize-first-letter'
import useSyncedRef from '../use-synced-ref'

export interface BaseIntersectionObserverOptions {
   onIntersection?: (entry: IntersectionObserverEntry) => void
   onlyTriggerOnce?: boolean
}

// prettier-ignore
export interface IntersectionObserverOptions<Key extends string = ''> extends IntersectionObserverInit, BaseIntersectionObserverOptions {
   key?: Key
}

export type IntersectionObserverResult<Key extends string> = Prettify<
   {
      [K in Key as Key extends '' ? 'element' : `${Key}Element`]: HTMLElement | null // element
   } & {
      [K in Key as Key extends '' ? 'setElementRef' : `set${Capitalize<Key>}ElementRef`]: (
         elementNode: HTMLElement | null
      ) => void // setElement
   } & {
      [K in Key as Key extends '' ? 'isElementIntersecting' : `is${Capitalize<Key>}ElementIntersecting`]: boolean // isElementIntersecting
   }
>

/**
 * @description
 *  A React hook that provides a declarative way to observe element visibility using the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API.
 *
 * @example
  import { useIntersectionObserver } from 'classic-react-hooks'

  export default function BasicExample() {
        const { element, setElementRef, isElementIntersecting } = useIntersectionObserver({
          threshold: 0.5,
          onIntersection: (entry) => {
              console.log('Intersection changed:', entry.isIntersecting)
          },
        })

        return (
          <div className='h-[200vh]'>
              <div className='mt-[100vh]'>
                <div ref={setElementRef} className={`p-5 ${isElementIntersecting ? 'bg-green-200' : 'bg-red-200'}`}>
                    {isElementIntersecting ? 'Visible!' : 'Not visible'}
                </div>
              </div>
          </div>
        )
    }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-intersection-observer.html
 */
export default function useIntersectionObserver<Key extends string = ''>(
   options?: IntersectionObserverOptions<Key>
): IntersectionObserverResult<Key> {
   const {
      key = '' as Key,
      onIntersection,
      onlyTriggerOnce = false,
      root,
      rootMargin,
      threshold,
      ...restOptions
   } = options ?? {}

   const [element, setElement] = useState<HTMLElement | null>(null)
   const [isIntersecting, setIsIntersecting] = useState(false)

   const onIntersectionRef = useSyncedRef(onIntersection)
   const observerOptions = useSyncedRef<IntersectionObserverInit>({
      root,
      rootMargin,
      threshold,
      ...restOptions,
   })

   const setElementRef = useRef((elementNode: HTMLElement | null) => {
      setElement(elementNode)
   })

   useEffect(() => {
      if (!window.IntersectionObserver) {
         if (process.env.NODE_ENV !== 'production') {
            console.warn('IntersectionObserver is not available.')
         }
         return
      }

      if (!element) {
         return
      }

      const observer = new IntersectionObserver((entries) => {
         for (const entry of entries) {
            const isCurrentlyIntersecting = entry.isIntersecting

            setIsIntersecting(entry.isIntersecting)

            // trigger onIntersection callback after intersection/non-intersection of the element
            if (onIntersectionRef.current) {
               onIntersectionRef.current?.(entry)
            }

            // handle onlyTriggerOnce
            if (onlyTriggerOnce && isCurrentlyIntersecting) {
               observer.unobserve(entry.target)
               observer.disconnect()
            }
         }
      }, observerOptions.current)

      observer.observe(element)

      return () => {
         if (element) {
            observer.unobserve(element)
            observer.disconnect()
         }
         setIsIntersecting(false)
      }
   }, [element, onlyTriggerOnce])

   const capKey = key ? capitalizeFirstLetter(key) : ''
   const propertyNames = {
      elementKey: key ? `${key}Element` : 'element',
      setRefKey: key ? `set${capKey}ElementRef` : 'setElementRef',
      isIntersectingKey: key ? `is${capKey}ElementIntersecting` : 'isElementIntersecting',
   }

   return {
      [propertyNames.setRefKey]: setElementRef.current,
      [propertyNames.isIntersectingKey]: isIntersecting,
      [propertyNames.elementKey]: element,
   } as IntersectionObserverResult<Key>
}
