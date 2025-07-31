---
outline: deep
---

# use-multiple-intersection-observer

A React hook that provides a convenient way to observe multiple elements simultaneously using the Intersection Observer API. Built on top of `useIntersectionObserver` for consistent behavior and TypeScript support.

::: warning
This hook requires you to understand the working of `useIntersectionObserver` hook. As it is built on top it, so it will help you to better understand about features of this hook. Read here [useIntersectionObserver](use-intersection-observer.html)
:::

## Features

-  **Multiple observers:** Create multiple intersection observers with a single hook call
-  **Consistent API:** Each observer follows the same pattern as `useIntersectionObserver`
-  **Type-safe:** Full TypeScript support with proper typing for all observer instances
-  **Shared configuration:** Apply the same options to all observers while maintaining individual keys
-  **Auto cleanup:** All observers are automatically cleaned up on unmount
-  **Performance optimized:** Each observer is independently managed for optimal performance

## Problem It Solves

::: info Multiple Hook Instance Boilerplate
**_Problem:_** Managing many intersection observers requires repetitive hook calls

```ts
// ❌ Without your hook - repetitive and verbose
const hero = useIntersectionObserver({ key: 'hero', threshold: 0.5 })
const about = useIntersectionObserver({ key: 'about', threshold: 0.5 })
const services = useIntersectionObserver({ key: 'services', threshold: 0.5 })
const contact = useIntersectionObserver({ key: 'contact', threshold: 0.5 })
```

**_Solution:_** Single hook call for multiple observers

```ts
// ✅ With your hook - clean and DRY
const sections = useMultipleIntersectionObserver(['hero', 'about', 'services', 'contact'], { threshold: 0.5 })
```

:::

::: info Memory and Performance Optimization
**_Problem:_** Managing lifecycle of multiple observers manually

-  Risk of memory leaks with multiple observer instances
-  Complex cleanup logic for dynamic observer sets

**_Solution:_** Automated lifecycle management

-  Leverages the proven cleanup logic of the base hook
-  Efficient memory usage through shared configuration
   :::

::: info Component Organization and Maintainability
**_Problem:_** Managing many observer hooks clutters component logic

-  Multiple hook calls at component top level
-  Scattered observer logic throughout component
-  Difficult to understand observer relationships

**_Solution:_** Clean, organized observer management

-  Single hook call consolidates all observer logic
-  Clear relationship between observed elements
-  Easier to reason about component behavior
   :::

::: info Type Safety at Scale
**_Problem:_** Maintaining type safety with multiple dynamically named properties

-  Lost type inference when managing multiple observers manually
-  No IntelliSense for dynamically generated property names
-  Runtime errors from typos in property access

**_Solution:_** Full type safety across all observers

```ts
// ✅ Full type safety and IntelliSense
const observers = useMultipleIntersectionObserver(['hero', 'footer'] as const)
// TypeScript knows: observers.hero.setHeroElementRef, observers.hero.isHeroElementIntersecting
// TypeScript knows: observers.footer.setFooterElementRef, observers.footer.isFooterElementIntersecting
```

:::

::: tip
For better performance with many elements, consider grouping related observations or using a single observer with multiple targets if the behavior is identical.
:::

## Parameters

| Parameter |               Type                | Required | Default Value | Description                                       |
| --------- | :-------------------------------: | :------: | :-----------: | ------------------------------------------------- |
| keys      |         `readonly Key[]`          |    ✅    |       -       | Array of unique keys for creating named observers |
| options   | [MultipleObserverOptions](#types) |    ❌    |   undefined   | Shared configuration for all observers            |

### Options Parameter

All options from `useIntersectionObserver` except `key` (which is provided via the `keys` array):

| Property          |                     Type                     |   Default   | Description                                    |
| ----------------- | :------------------------------------------: | :---------: | ---------------------------------------------- |
| `onIntersection`  | `(entry: IntersectionObserverEntry) => void` | `undefined` | Callback fired on intersection changes         |
| `onlyTriggerOnce` |                  `boolean`                   |   `false`   | Whether to observe only the first intersection |
| `root`            |        `Element \| Document \| null`         |   `null`    | Root element for intersection                  |
| `rootMargin`      |                   `string`                   |   `'0px'`   | Margin around root element                     |
| `threshold`       |             `number \| number[]`             |     `0`     | Intersection ratio threshold(s)                |

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

## Usage Examples

### Basic Multiple Observers

```tsx {4-8,14,17,23,27,30,36,40,43,49}
import { useMultipleIntersectionObserver } from 'classic-react-hooks'

export default function MultipleObserversExample() {
   const observers = useMultipleIntersectionObserver(['header', 'main', 'footer'] as const, {
      // [!code ++]
      threshold: 0.3,
      onIntersection: (entry) => {
         console.log('Element intersection changed:', entry.target.id)
      },
   })

   return (
      <div>
         <header
            ref={observers.header.setHeaderElementRef}
            style={{
               height: '200px',
               backgroundColor: observers.header.isHeaderElementIntersecting ? 'lightblue' : 'gray',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            <h1>Header {observers.header.isHeaderElementIntersecting ? '(Visible)' : '(Hidden)'}</h1>
         </header>

         <main
            ref={observers.main.setMainElementRef}
            style={{
               height: '100vh',
               backgroundColor: observers.main.isMainElementIntersecting ? 'lightgreen' : 'lightgray',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            <h2>Main Content {observers.main.isMainElementIntersecting ? '(Visible)' : '(Hidden)'}</h2>
         </main>

         <footer
            ref={observers.footer.setFooterElementRef}
            style={{
               height: '200px',
               backgroundColor: observers.footer.isFooterElementIntersecting ? 'lightcoral' : 'darkgray',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}
         >
            <h3>Footer {observers.footer.isFooterElementIntersecting ? '(Visible)' : '(Hidden)'}</h3>
         </footer>
      </div>
   )
}
```

::: danger Important
Each key in the array creates a separate `useIntersectionObserver` instance. While this provides maximum flexibility, consider the performance impact when observing many elements simultaneously.
:::

### Navigation Visibility Tracker

::: details

```tsx {4-7,10-14}
import { useMultipleIntersectionObserver } from 'classic-react-hooks'

export default function NavigationTracker() {
   const sections = useMultipleIntersectionObserver(['hero', 'about', 'services', 'contact'] as const, {
      threshold: 0.5,
      rootMargin: '-20% 0px -20% 0px', // Only trigger when element is well within viewport   // [!code ++]
   })

   // [!code ++]
   // Find the currently active section
   const activeSection =
      Object.entries(sections).find(
         ([key, observer]) => observer[`is${observer.constructor.name}ElementIntersecting` as keyof typeof observer]
      )?.[0] || null
   // [!code ++]

   return (
      <div>
         {/* Sticky Navigation */}
         <nav
            style={{
               position: 'fixed',
               top: 0,
               width: '100%',
               backgroundColor: 'white',
               padding: '10px',
               borderBottom: '1px solid #ccc',
               zIndex: 1000,
            }}
         >
            {(['hero', 'about', 'services', 'contact'] as const).map((section) => (
               <button
                  key={section}
                  style={{
                     margin: '0 10px',
                     padding: '5px 15px',
                     backgroundColor: activeSection === section ? 'blue' : 'lightgray', // [!code ++]
                     color: activeSection === section ? 'white' : 'black', // [!code ++]
                     border: 'none',
                     borderRadius: '4px',
                  }}
               >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
               </button>
            ))}
         </nav>

         {/* Sections */}
         <div style={{ marginTop: '60px' }}>
            <section
               ref={sections.hero.setHeroElementRef}
               style={{ height: '100vh', backgroundColor: '#ff6b6b', padding: '20px' }}
            >
               <h1>Hero Section</h1>
            </section>

            <section
               ref={sections.about.setAboutElementRef}
               style={{ height: '100vh', backgroundColor: '#4ecdc4', padding: '20px' }}
            >
               <h1>About Section</h1>
            </section>

            <section
               ref={sections.services.setServicesElementRef}
               style={{ height: '100vh', backgroundColor: '#45b7d1', padding: '20px' }}
            >
               <h1>Services Section</h1>
            </section>

            <section
               ref={sections.contact.setContactElementRef}
               style={{ height: '100vh', backgroundColor: '#f9ca24', padding: '20px' }}
            >
               <h1>Contact Section</h1>
            </section>
         </div>
      </div>
   )
}
```

:::

## Common Use Cases

-  **Multi-section navigation:** Track visibility of multiple page sections for active navigation states
-  **Lazy loading galleries:** Load multiple images or content blocks as they come into view
-  **Analytics tracking:** Monitor user engagement across different content areas
-  **Animation choreography:** Coordinate animations across multiple elements
-  **Performance monitoring:** Track which sections users actually view
-  **Infinite scroll sections:** Manage multiple loading zones in complex layouts
