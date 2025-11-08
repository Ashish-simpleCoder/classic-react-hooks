---
outline: deep
---

# use-intersection-observer

A React hook that provides a declarative way to observe element visibility using the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API.

::: danger Important

This hook automatically checks for `IntersectionObserver` support and logs a warning in development if it's not available. The hook will gracefully handle unsupported browsers by not creating observers.
:::

## Features

-  **Auto cleanup:** Automatic cleanup of observers on unmount and dependency change
-  **Reactive:** Listeners intelligently reattach when _`element`_ or _`onlyTriggerOnce`_ changes
-  **Flexible keys:** Support for custom property naming through the `key` parameter with full-type safety
-  **One-time Observation:** Built-in support for observing elements only once
-  **Full options support:** Full support for all `IntersectionObserverInit` options ([root](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root), [rootMargin](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin), [threshold](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds))

::: tip
This hook internally uses [useSyncedRef](/hooks/use-synced-ref) to avoid unnecessary re-renders when callback functions change
:::

## Problem It Solves

::: details Type-Safe Instance Management

-  **Dynamic & Type-Safe Properties:** Generates uniquely named properties for each observer with full TypeScript and IntelliSense support.
-  **Scalable:** Efficiently observe any number of elements without property naming conflicts.

````tsx
// Example: Dynamically named properties based on the 'key'
const { element, setElementRef, isElementIntersecting } = useIntersectionObserver() // Without key
const { sidebarElement, setSidebarElementRef, isSidebarElementIntersecting } = useIntersectionObserver({
   key: 'sidebar', // With key 'sidebar'
})


:::

::: details One-Time Observation Complexity

-  _`onlyTriggerOnce`_ option for automatically cleaning up observer after first intersection
   :::

## Parameters

| Parameter |                       Type                       | Required | Default Value | Description                                        |
| --------- | :----------------------------------------------: | :------: | :-----------: | -------------------------------------------------- |
| options   | [IntersectionObserverOptions](#type-definitions) |    ❌    |   undefined   | Configuration object for the intersection observer |

### Options Parameter

The `options` parameter accepts an object that extends the standard `IntersectionObserverInit` with an additional custom property for conditional event handling and post callback.

#### Standard _`IntersectionObserverInit`_ Options

| Property   |            Type             | Default | Description                     |
| ---------- | :-------------------------: | :-----: | ------------------------------- |
| key        |           string            |   ''    | Custom key for property naming  |
| root       | Element \| Document \| null |  null   | Root element for intersection   |
| rootMargin |           string            |   0px   | Margin around root element      |
| threshold  |     number \| number[]      |    0    | Intersection ratio threshold(s) |

#### Custom _`Options`_

| Property        |                    Type                    |  Default  | Description                                               |
| --------------- | :----------------------------------------: | :-------: | --------------------------------------------------------- |
| onlyTriggerOnce |                  boolean                   |   false   | Controls whether to observe only the initial intersection |
| onIntersection  | (entry: IntersectionObserverEntry) => void | undefined | Callback fired on every intersection of the element       |

### Type Definitions

::: details

```ts
export interface BaseIntersectionObserverOptions {
   onIntersection?: (entry: IntersectionObserverEntry) => void
   onlyTriggerOnce?: boolean
}

export interface IntersectionObserverOptions<Key extends string = ''>
   extends IntersectionObserverInit,
      BaseIntersectionObserverOptions {
   key?: Key
}

export type IntersectionObserverResult<Key extends string> = {
   // Dynamic property names based on key
   [K in Key as Key extends '' ? 'element' : `${Key}Element`]: HTMLElement | null
} & {
   [K in Key as Key extends '' ? 'setElementRef' : `set${Capitalize<Key>}ElementRef`]: (
      elementNode: HTMLElement | null
   ) => void
} & {
   [K in Key as Key extends '' ? 'isElementIntersecting' : `is${Capitalize<Key>}ElementIntersecting`]: boolean
}
````

:::

## Return Value(s)

The hook returns an object with dynamically named properties based on the `key` parameter:

-  **Without key:** `element`, `setElementRef`, `isElementIntersecting`
-  **With key:** `{key}Element`, `set{Key}ElementRef`, `is{Key}ElementIntersecting`

::: info
**`element`:** Holds the reference of element which is being observed, initial value is undefined.

**`setElementRef`:** A Setter function to store the element reference within `element`, which will be observed.

**`isElementIntersecting`:** Holds the boolean intersection status of the `element` weather it is intersecting the screen or not.
:::

## Common Use Cases

-  **Lazy loading:** Load images or content when they come into view
-  **Infinite scrolling:** Load more content when reaching the end
-  **Performance optimization:** Pause expensive operations when elements are not visible

## Usage Examples

### Basic Intersection Observer

```tsx {4-9,14}
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
```

### Using Custom Keys

::: details Example

```tsx {4-8}
import { useIntersectionObserver } from 'classic-react-hooks'

export default function CustomKeyExample() {
   const { heroElement, setHeroElementRef, isHeroElementIntersecting } = useIntersectionObserver({
      key: 'hero', // [!code ++]
      threshold: 0.3,
      rootMargin: '-50px',
   })

   return (
      <div>
         <header
            ref={setHeroElementRef}
            className={`h-96 ${
               isHeroElementIntersecting ? 'bg-blue-500' : 'bg-gray-500'
            } text-white flex items-center justify-center`}
         >
            <h1 className='text-3xl font-bold'>Hero Section {isHeroElementIntersecting ? '(Visible)' : '(Hidden)'}</h1>
         </header>
         <div className='h-[200vh] p-5'>
            <p>Scroll to see the hero section intersection status change</p>
         </div>
      </div>
   )
}
```

:::

### One-Time Trigger

::: details Example

```tsx {7-16}
import { useState } from 'react'
import { useIntersectionObserver } from 'classic-react-hooks'

export default function OneTimeExample() {
   const [hasBeenSeen, setHasBeenSeen] = useState(false)

   const { setElementRef, isElementIntersecting } = useIntersectionObserver({
      onlyTriggerOnce: true, // [!code ++]
      threshold: 0.8,
      onIntersection: (entry) => {
         if (entry.isIntersecting) {
            setHasBeenSeen(true)
            console.log('Element seen for the first time!')
         }
      },
   })

   return (
      <div className='h-[200vh]'>
         <div className='mt-[150vh]'>
            <div ref={setElementRef} className={`p-10 text-center ${hasBeenSeen ? 'bg-yellow-300' : 'bg-blue-200'}`}>
               {hasBeenSeen ? 'I was seen!' : 'Scroll down to see me'}
            </div>
         </div>
      </div>
   )
}
```

:::

### Multiple Thresholds

::: details Example

```tsx {4-10}
import { useIntersectionObserver } from 'classic-react-hooks'

export default function MultipleThresholdsExample() {
   const { setElementRef, isElementIntersecting } = useIntersectionObserver({
      threshold: [0, 0.25, 0.5, 0.75, 1.0], // [!code ++]
      onIntersection: (entry) => {
         const percentage = Math.round(entry.intersectionRatio * 100)
         console.log(`Element is ${percentage}% visible`)
      },
   })

   return (
      <div className='h-[200vh] p-5'>
         <div className='h-screen' />
         <div
            ref={setElementRef}
            className={`h-72 ${isElementIntersecting ? 'bg-green-200' : 'bg-red-200'} flex items-center justify-center`}
         >
            <h2 className='text-xl font-semibold'>Check console for intersection percentage</h2>
         </div>
      </div>
   )
}
```

:::
