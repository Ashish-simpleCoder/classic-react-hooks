import type { RefObject } from 'react'
import type { Prettify } from '../../types'

import { useState, useEffect } from 'react'

export type Target = HTMLElement | RefObject<HTMLElement> | (() => HTMLElement | null) | null

type Options = {
   mode?: 'lazy' | 'virtualized'
} & IntersectionObserverInit

/**
 * @description
 *  A hook which provides a way for listening to the Intersection Observer event for given target.
 *
 *  It takes an array of targets and returns an array of boolean values which represents whether the targets are intersecting the screen or not.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-intersection-observer.html
 */
export default function useInterSectionObserver(targets: Target[], options: Prettify<Options> = {}): Array<boolean> {
   const [visibilityStates, setVisiblilityStates] = useState(() => {
      return new Array(targets.length).fill(false) as Array<boolean>
   })

   const intersection_options: IntersectionObserverInit = {
      root: options.root,
      rootMargin: options.rootMargin,
      threshold: options.threshold,
   }

   if (!options.mode) {
      options.mode = 'lazy'
   }

   useEffect(() => {
      if (!window.IntersectionObserver) {
         console.warn('IntersectionObserver is not available.')
         return
      }
      const io = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
            const entry_idx = entry.target.getAttribute('idx')
            if (entry.isIntersecting) {
               setVisiblilityStates((_visibilityState) => {
                  if (entry_idx == null) return _visibilityState

                  _visibilityState[+entry_idx] = true
                  return [..._visibilityState]
               })
               if (options.mode == 'lazy') {
                  io.unobserve(entry.target)
               }
            } else {
               setVisiblilityStates((_visibilityState) => {
                  if (entry_idx == null) return _visibilityState

                  _visibilityState[+entry_idx] = false
                  return [..._visibilityState]
               })
            }
         })
      }, intersection_options)

      targets.forEach((element, idx) => observer(element, idx))

      function observer(element: Target, idx: number) {
         let target: HTMLElement | null = null

         try {
            if (element && 'current' in element) {
               target = element.current
            } else if (typeof element == 'function') {
               const ele = element()
               target = ele
            } else {
               target = element
            }
            if (target) {
               target.setAttribute('idx', idx.toString())
               io.observe(target)
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
