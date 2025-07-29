import type { IntersectionObserverOptions } from '../use-intersection-observer'

import useIntersectionObserver from '../use-intersection-observer'

export default function useMultipleIntersectionObserver<Key extends string>(
   keys: readonly Key[],
   options?: Omit<IntersectionObserverOptions, 'key'>
) {
   const observers = keys.reduce((acc, key) => {
      acc[key] = useIntersectionObserver({ ...options, key })
      return acc
   }, {} as Record<Key, ReturnType<typeof useIntersectionObserver<Key>>>)

   return observers
}
