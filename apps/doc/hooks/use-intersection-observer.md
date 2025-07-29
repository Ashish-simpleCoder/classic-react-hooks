---
outline: deep
---

# use-intersection-observer

A React hook that provides a declarative way to observe element visibility using the Intersection Observer API with automatic cleanup and type-safe manner.

::: danger Important

This hook automatically checks for `IntersectionObserver` support and logs a warning in development if it's not available. The hook will gracefully handle unsupported browsers by not creating observers.
:::

::: info
IntersectionObserver is supported in all modern browsers. For older browsers, you may need to include a polyfill.
:::

## Features

-  **Auto cleanup:** Observer is automatically disconnected on unmount or element changes
-  **Reactive:** The hook re-evaluates and potentially re-creates observers when dependencies change
-  **Type-safe:** Full TypeScript support with dynamic property naming based on key
-  **Flexible keys:** Support for custom property naming through the `key` parameter
-  **Standard options:** Full support for all `IntersectionObserverInit` options (root, rootMargin, threshold)
-  **Performance:** Observer is only created when element exists and IntersectionObserver is supported
-  **One-time observation:** Built-in support for observing elements only once

## Problem It Solves

::: info **Multiple Instance Management**

-  **Dynamic Key System:** Allows multiple intersection observers in the same component without naming conflicts
-  **Type-Safe Property Generation:** Each instance gets uniquely named properties with full TypeScript support
-  **Scalable Architecture:** Can observe unlimited elements without property collisions
   :::

::: info **Complex Intersection Observer Boilerplate**

-  **Eliminates** repetitive `IntersectionObserver` setup and teardown code
-  **Abstracts** away the complexity of observer lifecycle management
-  **Reduces** component code by `15-20 lines` per intersection observation
   :::

::: info **One-Time Observation Complexity**

-  `onlyTriggerOnce` option for automatically cleaning up observer after first intersection
   :::

::: info **Type Safety in Dynamic Scenarios**

-  Full TypeScript support with template literal types
-  IntelliSense support for dynamically generated property names

```tsx
// Without key
const { element, setElementRef, isElementIntersecting } = useIntersectionObserver()

// With key 'sidebar'
const { sidebarElement, setSidebarElementRef, isSidebarElementIntersecting } = useIntersectionObserver({
   key: 'sidebar',
})
```

:::

::: tip
The hook uses `useSyncedRef` to avoid unnecessary re-renders when callback functions change
:::

## Parameters

| Parameter |                 Type                  | Required | Default Value | Description                                        |
| --------- | :-----------------------------------: | :------: | :-----------: | -------------------------------------------------- |
| options   | [IntersectionObserverOptions](#types) |    ❌    |   undefined   | Configuration object for the intersection observer |

### Options Parameter

| Property          |                     Type                     |   Default   | Description                                    |
| ----------------- | :------------------------------------------: | :---------: | ---------------------------------------------- |
| `key`             |                   `string`                   |    `''`     | Custom key for property naming                 |
| `onIntersection`  | `(entry: IntersectionObserverEntry) => void` | `undefined` | Callback fired on intersection changes         |
| `onlyTriggerOnce` |                  `boolean`                   |   `false`   | Whether to observe only the first intersection |
| `root`            |        `Element \| Document \| null`         |   `null`    | Root element for intersection                  |
| `rootMargin`      |                   `string`                   |   `'0px'`   | Margin around root element                     |
| `threshold`       |             `number \| number[]`             |     `0`     | Intersection ratio threshold(s)                |

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
```

:::

## Return Value(s)

The hook returns an object with dynamically named properties based on the `key` parameter:

-  **Without key:** `element`, `setElementRef`, `isElementIntersecting`
-  **With key:** `{key}Element`, `set{Key}ElementRef`, `is{Key}ElementIntersecting`

::: info
**`element`:** Holds the element reference which is being observed, it's initial undefined.

**`setElementRef`:** Setter function to store the element reference within `element`, which is going tobe observed.

**`isElementIntersecting`:** Holds the boolean intersection status of the `element` weather it is intersecting the screen or not.
:::

## Usage Examples

### Basic Intersection Observer

```tsx {4-9,18,21}
import { useIntersectionObserver } from 'classic-react-hooks'

export default function BasicExample() {
   const { element, setElementRef, isElementIntersecting } = useIntersectionObserver({
      threshold: 0.5,
      onIntersection: (entry) => {
         console.log('Intersection changed:', entry.isIntersecting)
      },
   })

   return (
      <div style={{ height: '200vh' }}>
         <div style={{ marginTop: '100vh' }}>
            <div
               ref={setElementRef}
               style={{
                  padding: '20px',
                  backgroundColor: isElementIntersecting ? 'lightgreen' : 'lightcoral',
               }}
            >
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
            style={{
               height: '400px',
               backgroundColor: isHeroElementIntersecting ? 'blue' : 'gray',
               color: 'white',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            <h1>Hero Section {isHeroElementIntersecting ? '(Visible)' : '(Hidden)'}</h1>
         </header>
         <div style={{ height: '200vh', padding: '20px' }}>
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
      <div style={{ height: '200vh' }}>
         <div style={{ marginTop: '150vh' }}>
            <div
               ref={setElementRef}
               style={{
                  padding: '40px',
                  backgroundColor: hasBeenSeen ? 'gold' : 'lightblue',
                  textAlign: 'center',
               }}
            >
               {hasBeenSeen ? 'I was seen! 🎉' : 'Scroll down to see me'}
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
      <div style={{ height: '200vh', padding: '20px' }}>
         <div style={{ height: '100vh' }} />
         <div
            ref={setElementRef}
            style={{
               height: '300px',
               backgroundColor: isElementIntersecting ? 'lightgreen' : 'lightcoral',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            <h2>Check console for intersection percentage</h2>
         </div>
      </div>
   )
}
```

:::

## Common Use Cases

-  **Lazy loading:** Load images or content when they come into view
-  **Animation triggers:** Start animations when elements become visible
-  **Analytics:** Track when users view certain sections
-  **Infinite scrolling:** Load more content when reaching the end
-  **Sticky navigation:** Show/hide navigation based on hero section visibility
-  **Performance optimization:** Pause expensive operations when elements are not visible
