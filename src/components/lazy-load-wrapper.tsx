// @ts-nocheck
import type { Prettify } from '../types'
import type { ElementRef, ReactNode } from 'react'
import { Suspense, useRef } from 'react'

import useInterSectionObserver from '../lib/use-intersection-observer'

type LazyLoadWrapperProps = {
   PlaceholderElement?: <T>({ elementRef }: { elementRef: T }) => JSX.Element
   className?: string | ((isVisible: boolean) => string)
   suspense_fallback?: ReactNode
   mode?: 'lazy'
   children: ReactNode
   options?: IntersectionObserverInit
}

export default function LazyLoadWrapper({
   PlaceholderElement,
   className,
   children,
   options = {},
   mode,
   suspense_fallback,
}: LazyLoadWrapperProps) {
   const ref = useRef<ElementRef<'div'>>(null)
   const [shouldRender] = useInterSectionObserver(ref, {
      mode: mode,
      root: options.root,
      rootMargin: options.rootMargin,
      threshold: options.threshold,
   })

   const cn = () => {
      if (typeof className == 'function') {
         return className(shouldRender)
      }
      return className
   }

   if (shouldRender) {
      if (options && suspense_fallback) {
         return <Suspense fallback={suspense_fallback}>{children}</Suspense>
      }
      return <>{children}</>
   }

   if (PlaceholderElement) {
      return <PlaceholderElement elementRef={ref} />
   }

   return <div className={cn()} ref={ref}></div>
}
;<LazyLoadWrapper options={{}}>dev</LazyLoadWrapper>
