---
outline: deep
---

# use-multiple-intersection-observer

A React hook that provides a convenient way to observe multiple elements simultaneously using the [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) API.

::: info
Built on top of [useIntersectionObserver](use-intersection-observer.html) hook for type-safety and consistent behaviors.
:::

## Features

-  **Multiple observers:** Create multiple intersection observers with a single hook call
-  **Consistent API:** Each observer follows the same pattern as `useIntersectionObserver`
-  **Shared configuration:** Apply the same options to all observers while maintaining individual keys

## Problem It Solves

::: details Multiple Hook Instance Boilerplate
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
const sections = useMultipleIntersectionObserver(['hero', 'about', 'services', 'contact'], { threshold: 0.5 })
```

:::

::: details Type Safety at Scale
**Problem:** Maintaining type safety with multiple dynamically named properties

-  Loses type inference when managing multiple observers manually
-  No IntelliSense for dynamically generated property names
-  Runtime errors from typos in property access

**Solution:** Full type safety across all observers

```ts
// ✅ Full type safety and IntelliSense
const observers = useMultipleIntersectionObserver(['hero', 'footer'] as const)
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
import { useMultipleIntersectionObserver } from 'classic-react-hooks'

export default function MultipleObserversExample() {
   const observers = useMultipleIntersectionObserver(['header', 'main', 'footer'] as const, {
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
import { useMultipleIntersectionObserver } from 'classic-react-hooks'

export default function OneTimeExample() {
   const [hasBeenSeen, setHasBeenSeen] = useState(false)

   const { setElementRef, isElementIntersecting } = useMultipleIntersectionObserver({
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
