---
outline: deep
---

# use-intersection-observer

A React hook that provides a declarative way to observe multiple elements with the Intersection Observer API, returning their visibility states with advanced triggering options.

### Features

-  **Multiple targets:** Observe multiple elements simultaneously
-  **Flexible triggering:** Control whether elements trigger once or continuously
-  **Per-element configuration:** Different trigger behavior for each element
-  **Auto cleanup:** Observer is automatically disconnected on unmount
-  **Fallback support:** Graceful degradation when IntersectionObserver is not available
-  **Callback support:** Execute custom logic when elements become visible
-  **Performance:** Elements with `only_trigger_once: true` are automatically unobserved after first intersection
-  **Per-element control:** Use `only_trigger_once` as an array to control trigger behavior per element

### Parameters

| Parameter      |                  Type                  | Required |            Default            | Description                                             |
| -------------- | :------------------------------------: | :------: | :---------------------------: | ------------------------------------------------------- |
| targets        | [IntersectionObserverTarget[]](#types) |    ✅    |               -               | Array of functions that return target elements          |
| options        |     [IntersectionOptions](#types)      |    ❌    | "{ only_trigger_once: true }" | Intersection observer options and custom configurations |
| onIntersection |       (target: Element) => void        |    ❌    |           undefined           | Callback executed when an element becomes visible       |
|                |

#### Types

```ts
export type IntersectionObserverTarget = () => Element | null
export type IsTargetIntersecting = boolean

export interface IntersectionOptions extends IntersectionObserverInit {
   // Standard IntersectionObserverInit:
   // root?: Element | Document | null
   // rootMargin?: string
   // threshold?: number | number[]

   // Custom options
   only_trigger_once?: boolean | boolean[] // Control per-element trigger behavior
}
```

### Return Value

Returns an array of boolean values (`Array<IsTargetIntersecting>`) where each boolean represents whether the corresponding target element is currently intersecting (visible) or not.

### Usage Examples

#### Basic Usage - Multiple Elements

```ts
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
```

#### Per-Element Trigger Control

```ts
import { useRef } from 'react'
import { useInterSectionObserver } from 'classic-react-hooks'

export default function PerElementTrigger() {
   const onceRef = useRef<HTMLDivElement>(null)
   const continuousRef = useRef<HTMLDivElement>(null)
   const alsoOnceRef = useRef<HTMLDivElement>(null)

   const [isOnceVisible, isContinuousVisible, isAlsoOnceVisible] = useInterSectionObserver({
      targets: [() => onceRef.current, () => continuousRef.current, () => alsoOnceRef.current],
      options: {
         // Per-element trigger control: [once, continuous, once]
         only_trigger_once: [true, false, true],
         threshold: 0.5,
      },
   })

   return (
      <div>
         <div className='h-screen flex items-center justify-center text-xl font-semibold'>
            Scroll to see different behaviors
         </div>

         <div
            ref={onceRef}
            className={`h-48 my-12 mx-auto max-w-md flex items-center justify-center text-white font-semibold text-lg rounded-lg transition-colors duration-300 ${
               isOnceVisible ? 'bg-green-500' : 'bg-red-500'
            }`}
         >
            Triggers Once - {isOnceVisible ? 'Triggered!' : 'Waiting...'}
         </div>

         <div className='h-96 flex items-center justify-center text-gray-600 text-lg'>Scroll past and back up</div>

         <div
            ref={continuousRef}
            className={`h-48 my-12 mx-auto max-w-md flex items-center justify-center text-white font-semibold text-lg rounded-lg transition-colors duration-300 ${
               isContinuousVisible ? 'bg-blue-500' : 'bg-gray-500'
            }`}
         >
            Continuous - {isContinuousVisible ? 'Visible' : 'Hidden'}
         </div>

         <div className='h-96 flex items-center justify-center text-gray-600 text-lg'>Scroll past and back up</div>

         <div
            ref={alsoOnceRef}
            className={`h-48 my-12 mx-auto max-w-md flex items-center justify-center text-white font-semibold text-lg rounded-lg transition-colors duration-300 ${
               isAlsoOnceVisible ? 'bg-purple-500' : 'bg-orange-500'
            }`}
         >
            Also Triggers Once - {isAlsoOnceVisible ? 'Triggered!' : 'Waiting...'}
         </div>
      </div>
   )
}
```

#### With Intersection Callback

```ts
import { useRef, useState } from 'react'
import { useInterSectionObserver } from 'classic-react-hooks'

export default function WithCallback() {
   const [lastIntersected, setLastIntersected] = useState<string>('')
   const box1Ref = useRef<HTMLDivElement>(null)
   const box2Ref = useRef<HTMLDivElement>(null)

   const [isBox1Visible, isBox2Visible] = useInterSectionObserver({
      targets: [() => box1Ref.current, () => box2Ref.current],
      options: {
         threshold: 0.8,
         only_trigger_once: false,
      },
      onIntersection: (target) => {
         // Get the element's text content to identify which one intersected
         const elementText = target.textContent || 'Unknown'
         setLastIntersected(`${elementText} became visible at ${new Date().toLocaleTimeString()}`)

         // You could also trigger animations, analytics, lazy loading, etc.
         console.log('Element intersected:', target)
      },
   })

   return (
      <div>
         <div className='fixed top-0 left-0 bg-white p-3 border border-gray-300 rounded-br-lg shadow-md z-50 max-w-sm'>
            <div className='text-sm font-medium text-gray-700'>Last intersected:</div>
            <div className='text-xs text-gray-600 mt-1'>{lastIntersected || 'None yet'}</div>
         </div>

         <div className='h-screen pt-24 flex items-center justify-center text-xl font-semibold'>
            Scroll down to trigger intersections
         </div>

         <div
            ref={box1Ref}
            className={`h-72 my-24 mx-auto max-w-lg flex items-center justify-center text-2xl font-bold rounded-xl shadow-lg transition-colors duration-500 ${
               isBox1Visible ? 'bg-green-300 text-green-800' : 'bg-red-300 text-red-800'
            }`}
         >
            Box 1 - {isBox1Visible ? 'Visible' : 'Hidden'}
         </div>

         <div
            ref={box2Ref}
            className={`h-72 my-24 mx-auto max-w-lg flex items-center justify-center text-2xl font-bold rounded-xl shadow-lg transition-colors duration-500 ${
               isBox2Visible ? 'bg-blue-300 text-blue-800' : 'bg-yellow-300 text-yellow-800'
            }`}
         >
            Box 2 - {isBox2Visible ? 'Visible' : 'Hidden'}
         </div>

         <div className='h-screen flex items-center justify-center text-gray-500'>Bottom spacer</div>
      </div>
   )
}
```

### Important Notes

-  If IntersectionObserver is not supported, a warning is logged and the hook gracefully degrades.

### Common Use Cases

-  Lazy loading images or content
-  Triggering animations on scroll
-  Analytics tracking for element visibility
-  Infinite scrolling implementation
-  Performance optimization by conditionally rendering components
-  Scroll-triggered navigation highlighting
