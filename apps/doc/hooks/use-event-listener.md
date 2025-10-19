---
outline: deep
---

# use-event-listener

A React hook which provides a simple and declarative way to add DOM event listeners with automatic cleanup.

## Features

-  **Flexible target observing:** Observe element with `target` prop or use setter function `setElementRef`
-  **Auto cleanup:** Automatic cleanup of events on unmount and dependency change
-  **Reactive:** Potentially re-attaches listeners on dependency change(target, event, options)
-  **Conditional event:** Conditional event support with feature flag. And listeners only get attached when:- target exists, handler is provided, and `shouldInjectEvent` is true
-  **Standard options:** Full support for all `AddEventListenerOptions` (capture, once, passive, signal)

::: warning Usage Note

-  Do not pass `target` prop if using `setElementRef` and vise-versa.

:::

## Problem It Solves

::: details **Boilerplate Reduction**

-  **Problem:** Manually managing event listeners in React components leads to verbose, repetitive and error-prone code with potential memory leaks.

```tsx
// ❌ Problematic approach which is redundant and verbose
function Component() {
   const [scrollY, setScrollY] = useState(0)

   useEffect(() => {
      const handleScroll = () => {
         setScrollY(window.scrollY)
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll) // Doing proper cleanup on unmount
   }, [])

   return <div>Current: {scrollY}</div>
}
```

**Solution:**

-  Eliminates repetitive `addEventListener/removeEventListener` code
-  Reduces component complexity by abstracting event handling logic
-  Automatic cleanup ensures listeners are removed when:-

   -> Component unmounts

   -> `Target` element changes

   -> `Event` type changes

   -> Any of `Options` params:- `shouldInjectEvent`, `capture`, `once`, `passive`, `signal` gets changed

```tsx
// ✅ Clean, declarative approach
function Component() {
   const [scrollY, setScrollY] = useState(0)
   const breakpoint = useEventListener({
      target: () => window,
      event: 'scroll',
      handler: () => {
         setScrollY(window.scrollY)
      },
   })

   return <div>Current: {scrollY}</div>
}
```

:::

::: details **Performance Benefits**

-  Stable references accross re-renders which prevents listeners from being repeatedly added/removed

-  Efficient dependency tracking

:::

## Parameters

| Parameter |              Type              | Required | Default Value | Description                                       |
| --------- | :----------------------------: | :------: | :-----------: | ------------------------------------------------- |
| target    | [EvTarget](#type-definitions)  |    ✅    |       -       | Target element on which the event is listened to. |
| event     |             string             |    ✅    |       -       | Event name (e.g. 'click', 'keydown')              |
| handler   | [EvHandler](#type-definitions) |    ❌    |   undefined   | Event listener callback function                  |
| options   | [EvOptions](#type-definitions) |    ❌    |   undefined   | Event listener options and feature flags          |
|           |

### Options Parameter

The `options` parameter accepts an object that extends the standard `AddEventListenerOptions` with an additional custom property for conditional event handling.

#### Standard AddEventListenerOptions

| Property | Type        | Default   | Description                                                                      |
| -------- | ----------- | --------- | -------------------------------------------------------------------------------- |
| capture  | boolean     | false     | If `true`, the listener will be triggered during the capture phase               |
| once     | boolean     | false     | If `true`, the listener will be automatically removed after being triggered once |
| passive  | boolean     | false     | If `true`, indicates that the function will never call `preventDefault()`        |
| signal   | AbortSignal | undefined | An AbortSignal that can be used to remove the event listener                     |

#### Custom Options

| Property          | Type           | Default | Description                                                                                         |
| ----------------- | -------------- | ------- | --------------------------------------------------------------------------------------------------- |
| shouldInjectEvent | boolean \| any | true    | Controls whether the event listener should be attached. When false, the event listener is not added |

### Type Definitions

::: details

```ts
export type EvTarget = () => EventTarget | null
export type EvHandler = (event: Event) => void

export interface EvOptions extends AddEventListenerOptions {
   // Standard AddEventListenerOptions:
   capture?: boolean
   once?: boolean
   passive?: boolean
   signal?: AbortSignal

   // Custom option:
   shouldInjectEvent?: boolean | any // Controls whether the event should be attached
}
```

:::

## Return Value(s)

This hook returns an object containing the setter function for observing the target element with `ref` attribute

| Property      | Type                      | Description                                                                                          |
| ------------- | ------------------------- | ---------------------------------------------------------------------------------------------------- |
| setElementRef | [Function](#return-types) | A ref callback to observe the target element for event listening. Does not change across re-renders. |

### Return Types

::: details

```ts
export type UseEventListenerReturnValues = {
   setElementRef: (elementNode: HTMLElement | null) => void
}
```

:::

## Common Use Cases

-  Adding dom events (e.g 'click', 'keydown', 'resize', 'scroll')

## Usage Examples

### Basic Click Handler

```ts {7-13}
import { useRef } from 'react'
import { useEventListener } from 'classic-react-hooks'

export default function ClickExample() {
   const buttonRef = useRef<HTMLButtonElement>(null)

   useEventListener({
      target: () => buttonRef.current,
      event: 'click',
      handler: (e) => {
         console.log('Button clicked!', e)
      },
   })

   return <button ref={buttonRef}>Click me</button>
}
```

### Listening Window Event

::: details Example

```ts {6-9}
import { useEventListener } from 'classic-react-hooks'

export default function WindowExample() {
   useEventListener({
      target: () => window,
      event: 'resize',
      handler: (e) => {
         console.log('Window resized:', window.innerWidth, window.innerHeight)
      },
   })

   return <div>Resize the window and check console</div>
}
```

:::

### Conditional Event Listening

::: details Example

```ts
import { useState } from 'react'
import { useEventListener } from 'classic-react-hooks'

export default function ConditionalExample() {
   const [isListening, setIsListening] = useState(true) // [!code ++]

   useEventListener({
      target: () => document,
      event: 'keydown',
      handler: (e) => {
         console.log('Key pressed:', e.key)
      },
      options: {
         shouldInjectEvent: isListening, // Only listen when enabled  // [!code ++]
      },
   })

   return (
      <div>
         <button onClick={() => setIsListening(!isListening)}>{isListening ? 'Stop' : 'Start'} Listening</button>
         <p>Press any key (when listening is enabled)</p>
      </div>
   )
}
```

:::

### `setElementRef` for Observing target

::: details Example

```ts {6,18}
import { useState } from 'react'
import { useEventListener } from 'classic-react-hooks'

export default function ConditionalExample() {
   const [counter, setCounter] = useState(0)
   const { setElementRef } = useEventListener({
      event: 'click',
      handler: () => {
         console.log(counter)
      },
   })

   return (
      <div>
         <button onClick={() => setCounter((c) => c + 1)}>update counter {counter}</button>
         <div ref={setElementRef}>log value</div>
      </div>
   )
}
```

:::
