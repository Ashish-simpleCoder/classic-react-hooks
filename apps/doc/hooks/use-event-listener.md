---
outline: deep
---

# use-event-listener

A React hook that provides a declarative way to add DOM event listeners with automatic cleanup.

## Features

-  **Auto cleanup:** Events are automatically removed on unmount or dependency changes
-  **Reactive:** The hook re-evaluates and potentially re-attaches listeners when any dependency changes (target, event, options)
-  **Conditional events:** Built-in support for conditionally enabling/disabling event
-  **Performance:** Event listeners are only attached when all conditions are met: target exists, handler is provided, and `shouldInjectEvent` is true
-  **Standard options:** Full support for all `AddEventListenerOptions` (capture, once, passive, signal)

## Problem It Solves

::: info **Declarative API**

-  Event handling becomes part of component's declarative structure
-  Better integration with React's mental model
   :::

::: info **Boilerplate Reduction**

-  Eliminates repetitive `addEventListener/removeEventListener` code
-  Reduces component complexity by abstracting event handling logic
-  No need to manually manage cleanup in useEffect return functions.
   Automatic cleanup ensures event listeners are removed when

   -> Component unmounts

   -> Target element changes

   -> Event type changes

   -> Options params `shouldInjectEvent`, `capture`, `once`, `passive`, `signal` gets changed

:::

::: info **Performance Benefits**

-  Stable references which prevent event listeners from being repeatedly added/removed

-  Efficient dependency tracking in the effect hooks

:::

## Parameters

| Parameter |        Type         | Required | Default Value | Description                                      |
| --------- | :-----------------: | :------: | :-----------: | ------------------------------------------------ |
| target    | [EvTarget](#types)  |    ✅    |       -       | Function that returns the target element or null |
| event     |       string        |    ✅    |       -       | Event name (e.g., 'click', 'keydown', 'resize')  |
| handler   | [EvHandler](#types) |    ❌    |   undefined   | Event handler callback function                  |
| options   | [EvOptions](#types) |    ❌    |   undefined   | Event listener options and feature flags         |
|           |

### Options Parameter

The `options` parameter accepts an object that extends the standard `AddEventListenerOptions` with an additional custom property for conditional event handling.

#### Standard AddEventListenerOptions

| Property  | Type          | Default     | Description                                                                      |
| --------- | ------------- | ----------- | -------------------------------------------------------------------------------- |
| `capture` | `boolean`     | `false`     | If `true`, the listener will be triggered during the capture phase               |
| `once`    | `boolean`     | `false`     | If `true`, the listener will be automatically removed after being triggered once |
| `passive` | `boolean`     | `false`     | If `true`, indicates that the function will never call `preventDefault()`        |
| `signal`  | `AbortSignal` | `undefined` | An AbortSignal that can be used to remove the event listener                     |

#### Custom Options

| Property            | Type             | Default | Description                                                                                         |
| ------------------- | ---------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `shouldInjectEvent` | `boolean \| any` | `true`  | Controls whether the event listener should be attached. When falsy, the event listener is not added |

### Type Definitions

::: details

```ts
export type EvTarget = () => EventTarget | null
export type EvHandler = (event: Event) => void

export interface EvOptions extends AddEventListenerOptions {
   // Standard AddEventListenerOptions:
   // capture?: boolean
   // once?: boolean
   // passive?: boolean
   // signal?: AbortSignal

   // Custom option:
   shouldInjectEvent?: boolean | any // Controls whether the event should be attached
}
```

:::

## Return Value(s)

This hook does not return anything.

| Return Value | Type   | Description                                                                                           |
| ------------ | ------ | ----------------------------------------------------------------------------------------------------- |
| `void`       | `void` | This hook does not return any value. It performs side effects only (adding/removing event listeners). |

## Usage Examples

### Basic Click Handler

```ts {5,7-13,15}
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

::: details

### Window Events

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

::: details

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
         <button onClick={() => setIsListening(!isListening)}>{isListening ? 'Stop' : 'Start'} Listening</button> //
         [!code ++]
         <p>Press any key (when listening is enabled)</p>
      </div>
   )
}
```

:::

## Common Use Cases

-  Adding dom events (e.g 'click', 'keydown', 'resize')
