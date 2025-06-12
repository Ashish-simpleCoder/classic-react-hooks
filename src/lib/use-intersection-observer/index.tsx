import type { IntersectionOptions, IntersectionObserverTarget, IsTargetIntersecting } from '../../types'

import { useEffect, useState } from 'react'

/**
 * @description
 *  A React hook that provides a declarative way to observe multiple elements with the Intersection Observer API, returning their visibility states with advanced triggering options.
 * 
 * @example
   import { useRef } from 'react'
   import { useInterSectionObserver } from 'classic-react-hooks'

   export default function BasicIntersection() {
      const box1Ref = useRef<HTMLDivElement>(null)
      const box2Ref = useRef<HTMLDivElement>(null)
      const box3Ref = useRef<HTMLDivElement>(null)

      const [isBox1Visible, isBox2Visible, isBox3Visible] = useInterSectionObserver({
         targets: [() => box1Ref.current, () => box2Ref.current, () => box3Ref.current],
      })

      return (
         <div>
            <div className='h-screen flex items-center justify-center text-xl'>Scroll down to see boxes</div>

            <div
               ref={box1Ref}
               className={`h-48 my-12 mx-auto max-w-md flex items-center justify-center text-white font-semibold text-lg rounded-lg transition-colors duration-300 ${
                  isBox1Visible ? 'bg-green-500' : 'bg-red-500'
               }`}
            >
               Box 1 - {isBox1Visible ? 'Visible' : 'Hidden'}
            </div>

            <div
               ref={box2Ref}
               className={`h-48 my-12 mx-auto max-w-md flex items-center justify-center text-white font-semibold text-lg rounded-lg transition-colors duration-300 ${
                  isBox2Visible ? 'bg-blue-500' : 'bg-gray-500'
               }`}
            >
               Box 2 - {isBox2Visible ? 'Visible' : 'Hidden'}
            </div>

            <div
               ref={box3Ref}
               className={`h-48 my-12 mx-auto max-w-md flex items-center justify-center text-white font-semibold text-lg rounded-lg transition-colors duration-300 ${
                  isBox3Visible ? 'bg-purple-500' : 'bg-orange-500'
               }`}
            >
               Box 3 - {isBox3Visible ? 'Visible' : 'Hidden'}
            </div>
         </div>
      )
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-intersection-observer.html
 */
export default function useInterSectionObserver({
   targets,
   options = { only_trigger_once: true },
   onIntersection,
}: {
   targets: IntersectionObserverTarget[]
   options?: IntersectionOptions
   onIntersection?: (target: Element) => void
}): Array<IsTargetIntersecting> {
   const [visibilityStates, setVisiblilityStates] = useState(() => {
      return new Array(targets.length).fill(false) as Array<IsTargetIntersecting>
   })

   const intersection_options: IntersectionObserverInit = {
      root: options.root,
      rootMargin: options.rootMargin,
      threshold: options.threshold,
   }

   useEffect(() => {
      if (!window.IntersectionObserver) {
         console.warn('IntersectionObserver is not available.')
         return
      }
      options = {
         only_trigger_once: true,
         ...options,
      }
      const io = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
            const entry_idx = Number(entry.target.getAttribute('idx') ?? -1) // assign -1 to ignore the observation

            if (entry.isIntersecting) {
               setVisiblilityStates((_visibilityState) => {
                  if (entry_idx == -1) return _visibilityState

                  _visibilityState[entry_idx] = true
                  return [..._visibilityState]
               })
               // unobserve the target in each iteration if only_trigger_once is true
               if (options.only_trigger_once == true) {
                  io.unobserve(entry.target)
               } else if (Array.isArray(options.only_trigger_once)) {
                  if (entry_idx != -1 && options.only_trigger_once[entry_idx] == true)
                     // if for an specific element, only_trigger_once is true, then unobserve it
                     io.unobserve(entry.target)
               }
               // callback to run after element is visible on screen
               onIntersection?.(entry.target)
            } else {
               setVisiblilityStates((_visibilityState) => {
                  if (entry_idx == -1) return _visibilityState

                  _visibilityState[entry_idx] = false
                  return [..._visibilityState]
               })
            }
         })
      }, intersection_options)

      targets.forEach((element, idx) => observer(element, idx))

      function observer(element: IntersectionObserverTarget, idx: number) {
         try {
            if (typeof element == 'function') {
               const ele = element()
               if (!ele || !(ele instanceof Element)) return
               ele.setAttribute('idx', idx.toString())
               io.observe(ele)
            }
         } catch (err) {
            console.warn(err)
         }
      }

      return () => {
         io.disconnect()
      }
   }, [])

   return visibilityStates
}
