---
outline: deep
---

# use-event-listener

_`use-event-listener`_ is a declarative React hook that simplifies DOM event handling with automatic lifecycle management.

It eliminates repetitive add/removeEventListener boilerplate while preventing memory leaks through intelligent cleanup on unmount or dependency changes.

This hook supports flexible targeting via either a target prop or setElementRef callback, and features built-in conditional binding. It fully supports all standard AddEventListenerOptions including capture, once, passive, and signal.

## Features

-  **Declarative event handling:** Attach DOM events via a clean, hook-based API
-  **Flexible targeting:** Bind listeners using a `target` function or `setElementRef` callback
-  **Automatic cleanup:** Listeners are removed on unmount or dependency changes
-  **Reactive rebinding:** Reattaches automatically when target, event, or options change
-  **Conditional binding:** Toggle listener attachment with `shouldInjectEvent`
-  **Full options support:** Supports all `AddEventListenerOptions` (`capture`, `once`, `passive`, `signal`)
-  **Stable references:** Avoids unnecessary add/remove cycles across re-renders
-  **Ref-free usage:** No manual refs needed when using `setElementRef`

::: warning Usage Note

-  Do not pass _`target`_ prop if using _`setElementRef`_ and vise-versa.

:::

## Problem It Solves

::: details **Boilerplate Reduction**

Manually managing event listeners in React components leads to verbose, repetitive and error-prone code with potential memory leaks.
See the below implementation:

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

---

How _`use-event-listener`_ solves it:

-  Eliminates repetitive `addEventListener/removeEventListener` code
-  Reduces component complexity by abstracting event handling logic
-  Makes conditional event attachment predictable and declarative
-  Simplifies dynamic event binding when below things happens:-
   -  Component unmounts
   -  `target` element changes
   -  `event` type changes
   -  Any of `options` params:- (_shouldInjectEvent_, _capture_, _once_, _passive_, _signal_) gets changed

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
-  Prevents memory leaks caused by missed or incorrect cleanup
-  Eliminates manual lifecycle management for DOM event listeners
-  Avoids unnecessary listener re-creation across component re-renders
   :::

## Parameters

| Parameter |              Type              | Required | Default Value | Description                                       |
| --------- | :----------------------------: | :------: | :-----------: | ------------------------------------------------- |
| target    | [EvTarget](#type-definitions)  |    ✅    |       -       | Target element on which the event is listened to. |
| event     |             string             |    ✅    |       -       | Event name (e.g. 'click', 'keydown')              |
| handler   | [EvHandler](#type-definitions) |    ❌    |   undefined   | Event listener callback function                  |
| options   | [EvOptions](#type-definitions) |    ❌    |   undefined   | Standard Options and Feature flags                |
|           |

### Options Parameter

The _`options`_ parameter supports all standard _`AddEventListenerOptions`_ and introduces extra custom properties to control conditional event binding.

#### Standard _`AddEventListenerOptions`_

| Property | Type        | Default   | Description                                                                      |
| -------- | ----------- | --------- | -------------------------------------------------------------------------------- |
| capture  | boolean     | false     | If `true`, the listener will be triggered during the capture phase               |
| once     | boolean     | false     | If `true`, the listener will be automatically removed after being triggered once |
| passive  | boolean     | false     | If `true`, indicates that the function will never call `preventDefault()`        |
| signal   | AbortSignal | undefined | An AbortSignal that can be used to remove the event listener                     |

#### Custom _`Options`_

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

This hook returns an object that includes a setter function, allowing you to observe and manage the target element through its ref attribute.

| Property      | Type                      | Description                                                         |
| ------------- | ------------------------- | ------------------------------------------------------------------- |
| setElementRef | [Function](#return-types) | A ref callback that observes the target element for event listening |

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

### Usage with `setElementRef`(no manual creation of ref)

```ts {6,16}
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

### Basic Click Handler

::: details Exampls

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

:::

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
