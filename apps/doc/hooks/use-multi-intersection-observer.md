---
outline: deep
---

# use-multi-intersection-observer

_`use-multi-intersection-observer`_ is a React hook that enables observing multiple elements simultaneously using a single, unified API.

Built on top of [use-intersection-observer](use-intersection-observer.html), it preserves full type safety, predictable behavior, and consistent return shapes. The hook reduces boilerplate by allowing shared configuration while generating uniquely typed observers for each key. It scales intersection tracking cleanly across complex layouts and multi-section UIs.

## Features

-  **Multiple observers, one hook:** Create many intersection observers with a single call
-  **Unified API:** Each observer mirrors the [use-intersection-observer](use-intersection-observer.html) API
-  **Full type safety:** Strong TypeScript inference with IntelliSense for all properties
-  **Key-based access:** Access each observer via a unique key
-  **Shared configuration:** Apply common `IntersectionObserver` options across observers
-  **Independent state:** Each observer manages its own element ref and intersection state
-  **Proven core:** Built on `use-intersection-observer` for consistency and reliability

## Problem It Solves

::: details Eliminates repetitive `use-intersection-observer` calls for multiple elements
**Problem:** Managing many intersection observers requires repetitive hook calls

```ts
// ❌ Without multi-observer hook - repetitive
const hero = useIntersectionObserver({ key: 'hero', threshold: 0.5 })
const about = useIntersectionObserver({ key: 'about', threshold: 0.5 })
const services = useIntersectionObserver({ key: 'services', threshold: 0.5 })
const contact = useIntersectionObserver({ key: 'contact', threshold: 0.5 })
```

**Solution:** Single hook call for multiple observers

```ts
// ✅ With multi-observer hook
const sections = useMultiIntersectionObserver(['hero', 'about', 'services', 'contact'], { threshold: 0.5 })
```

:::

::: details Type Safety at Scale
**Problem:** Maintaining type safety with multiple dynamically named properties

-  Loses type inference while managing multiple observers manually
-  No IntelliSense for dynamically generated property names
-  Runtime errors due to typos in property access

**Solution:** This hook provides full type safety and comprehensive IntelliSense for all generated observer properties

```ts
// ✅ Full type safety and IntelliSense
const observers = useMultiIntersectionObserver(['hero', 'footer'] as const)
// TypeScript knows: observers.hero.setHeroElementRef, observers.hero.isHeroElementIntersecting
// TypeScript knows: observers.footer.setFooterElementRef, observers.footer.isFooterElementIntersecting
```

:::

## Parameters

| Parameter |                     Type                     | Required | Default Value | Description                                       |
| --------- | :------------------------------------------: | :------: | :-----------: | ------------------------------------------------- |
| keys      |                readonly Key[]                |    ✅    |       -       | Array of unique keys for creating named observers |
| options   | [MultipleObserverOptions](#type-definitions) |    ❌    |   undefined   | Shared configuration for all observers            |

### Options Parameter

All options from [useIntersectionObserver](use-intersection-observer.html) except `key` (which is provided via the `keys` array):

### Type Definitions

::: details

```ts
export type MultipleObserverOptions = Omit<IntersectionObserverOptions, 'key'>

// Return type is a record where each key maps to its observer result
type MultipleIntersectionObserverResult<Key extends string> = Record<
   Key,
   ReturnType<typeof useIntersectionObserver<Key>>
>
```

:::

## Return Value(s)

The hook returns a record object where each key from the input array maps to its corresponding intersection observer result:

-  **Without key:** `element`, `setElementRef`, `isElementIntersecting`
-  **With key:** `{key}Element`, `set{Key}ElementRef`, `is{Key}ElementIntersecting`

```ts
// Object contains all of the obervers
{   // [!code ++]
  [key]: {
    [`${key}Element`]: HTMLElement | null,
    [`set${Capitalize<Key>}ElementRef`]: (element: HTMLElement | null) => void,
    [`is${Capitalize<Key>}ElementIntersecting`]: boolean
  }
}  // [!code ++]
```

::: info
**`{key}Element`:** Holds the element reference which is being observed, it's initially undefined.

**`set{Capitalize<key>}ElementRef`:** Setter function to store the element reference within `element`, which is going tobe observed.

**`is{Capitalize<key>}ElementIntersecting`:** Holds the boolean intersection status of the `element` weather it is intersecting the screen or not.
:::

## Common Use Cases

-  **Multi-section navigation:** Track visibility of multiple page sections for active navigation states
-  **Lazy loading galleries:** Load multiple images or content blocks as they come into view

## Usage Examples

### Basic Multiple Observers

```tsx {4-9}
import { useMultiIntersectionObserver } from 'classic-react-hooks'

export default function MultipleObserversExample() {
   const observers = useMultiIntersectionObserver(['header', 'main', 'footer'] as const, {
      threshold: 0.3,
      onIntersection: (entry) => {
         console.log('Element intersection changed:', entry.target.id)
      },
   })

   return (
      <div>
         <header
            ref={observers.header.setHeaderElementRef}
            className={`h-48 ${
               observers.header.isHeaderElementIntersecting ? 'bg-blue-200' : 'bg-gray-500'
            } flex items-center justify-center`}
         >
            <h1 className='text-2xl font-bold'>
               Header {observers.header.isHeaderElementIntersecting ? '(Visible)' : '(Hidden)'}
            </h1>
         </header>

         <main
            ref={observers.main.setMainElementRef}
            className={`h-screen ${
               observers.main.isMainElementIntersecting ? 'bg-green-200' : 'bg-gray-200'
            } flex items-center justify-center`}
         >
            <h2 className='text-xl font-semibold'>
               Main Content {observers.main.isMainElementIntersecting ? '(Visible)' : '(Hidden)'}
            </h2>
         </main>

         <footer
            ref={observers.footer.setFooterElementRef}
            className={`h-48 ${
               observers.footer.isFooterElementIntersecting ? 'bg-red-200' : 'bg-gray-600'
            } flex items-center justify-center`}
         >
            <h3 className='text-lg font-medium'>
               Footer {observers.footer.isFooterElementIntersecting ? '(Visible)' : '(Hidden)'}
            </h3>
         </footer>
      </div>
   )
}
```

::: danger Important
Each key in the array creates a separate `useIntersectionObserver` instance. While this provides maximum flexibility, consider the performance impact when observing many elements simultaneously.
:::

### One-Time Trigger

::: details Example

```tsx {7-16}
import { useState } from 'react'
import { useMultiIntersectionObserver } from 'classic-react-hooks'

export default function OneTimeExample() {
   const [hasBeenSeen, setHasBeenSeen] = useState(false)

   const { setElementRef, isElementIntersecting } = useMultiIntersectionObserver({
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
