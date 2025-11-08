---
outline: deep
---

# use-outside-click

A React hook that detects outside click for specified element and triggers the given callback.

::: tip
Perfect for implementing modals, dropdowns and other UI components that need to be closed when users click outside of them.
:::

## Features

-  **Precise trigger:** Precise outside click detection
-  **Performance:** Optimized with capture phase events
-  **Underlying hook:** At its core, it uses [useEventListener](use-event-listener.html) hook

## Parameters

| Parameter |              Type              | Required | Default Value | Description                                      |
| --------- | :----------------------------: | :------: | :-----------: | ------------------------------------------------ |
| target    | [EvTarget](#type-definitions)  |    ✅    |       -       | Function that returns the target element or null |
| handler   | [EvHandler](#type-definitions) |    ❌    |   undefined   | Callback executed on outside click               |
| options   | [EvOptions](#type-definitions) |    ❌    |   undefined   | Event listener options and feature flags         |

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

```tsx
type EvTarget = () => EventTarget | null
type EvHandler = (event: DocumentEventMap['click']) => void

interface EvOptions extends AddEventListenerOptions {
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

## Common Use Cases

-  Modal dialogs - Close when clicking backdrop
-  Dropdown menus - Hide when clicking elsewhere
-  Context menus - Dismiss on outside click

## Usage Examples

::: info Note
Refer to [use-event-listener](/hooks/use-event-listener.html#basic-click-handler) hook for more examples.
:::

### Modal Component

```ts
import { useState } from 'react'
import { useOutsideClick } from 'classic-react-hooks'

function Modal() {
   const [isOpen, setIsOpen] = useState(false)

   const { setElementRef } = useOutsideClick({
      handler: () => setIsOpen(false),
   })

   if (!isOpen) {
      return <button onClick={() => setIsOpen(true)}>Open Modal</button>
   }

   return (
      <div className='modal-overlay'>
         <div ref={setElementRef} class='modal-content bg-white p-8 rounded-lg shadow-md'>
            <h2>Modal Title</h2>
            <p>Click outside this modal to close it.</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
         </div>
      </div>
   )
}
```
