import type { IntersectionOptions, IntersectionObserverTarget, IsTargetIntersecting } from '../../types'

import { useEffect, useState } from 'react'

/**
 * @description
 *  A hook which provides a way for listening to the Intersection Observer event for given target.
 *
 *  It takes an array of targets and returns an array of boolean values which represents whether the targets are intersecting to the screen or not.
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
