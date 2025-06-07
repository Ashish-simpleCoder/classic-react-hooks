---
outline: deep
---

# use-event-listener

A React hook that provides a declarative way to add DOM event listeners with automatic cleanup.

### Features

-  **Auto cleanup:** Events are automatically removed on unmount or dependency changes
-  **Reactive:** The hook re-evaluates and potentially re-attaches listeners when any dependency changes (target, event, options)
-  **Conditional events:** Built-in support for conditionally enabling/disabling event
-  **Performance:** Event listeners are only attached when all conditions are met: target exists, handler is provided, and `shouldInjectEvent` is true
-  **Standard options:** Full support for all `AddEventListenerOptions` (capture, once, passive, signal)

### Parameters

| Parameter |        Type         | Required | Default Value | Description                                      |
| --------- | :-----------------: | :------: | :-----------: | ------------------------------------------------ |
| target    | [EvTarget](#types)  |    ✅    |       -       | Function that returns the target element or null |
| event     |       string        |    ✅    |       -       | Event name (e.g., 'click', 'keydown', 'resize')  |
| handler   | [EvHandler](#types) |    ❌    |   undefined   | Event handler callback function                  |
| options   | [EvOptions](#types) |    ❌    |   undefined   | Event listener options and feature flags         |
|           |

#### Types

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

### Usage Examples

#### Basic Click Handler

```ts
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

#### Window Events

```ts
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

#### Conditional Event Listening

```ts
import { useState } from 'react'
import { useEventListener } from 'classic-react-hooks'

export default function ConditionalExample() {
   const [isListening, setIsListening] = useState(true)

   useEventListener({
      target: () => document,
      event: 'keydown',
      handler: (e) => {
         console.log('Key pressed:', e.key)
      },
      options: {
         shouldInjectEvent: isListening, // Only listen when enabled
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

### Common Use Cases

-  Adding dom events (e.g 'click', 'keydown', 'resize')
