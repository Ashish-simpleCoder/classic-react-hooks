---
outline: deep
---

# use-outside-click

_`use-outside-click`_ is a React hook that detects clicks occurring outside a specified element and triggers a callback in response.

It provides a reliable, declarative solution for dismissible UI components such as modals, dropdowns, and context menus. Built on top of [use-event-listener](use-event-listener.html), it ensures proper event lifecycle management while remaining bubble-phase friendly. The hook integrates seamlessly with React refs and supports conditional event binding.

::: tip
Perfect for implementing modals, dropdowns and other UI components that need to be closed when users click outside of them.
:::

## Features

-  **Accurate outside click detection:** Triggers callbacks only when clicks occur outside the target element
-  **Bubble-phase handling:** Always listens in the bubbling phase for predictable interaction control
-  **Declarative API:** Attach outside click behavior without imperative DOM logic
-  **Automatic cleanup:** Event listeners are safely removed on unmount or option changes
-  **Conditional binding:** Control listener attachment via `shouldInjectEvent`
-  **Ref-based targeting:** Use `setElementRef` to track the target element without manual refs

*  **Underlying hook:** Built on top of the [use-event-listener](use-event-listener.html) hook

## Problems It Solves

-  Eliminates manual document click listener setup and cleanup
-  Prevents common bugs in outside click detection logic
-  Avoids memory leaks caused by forgotten event listener removal
-  Simplifies dismissible UI behavior across components
-  Preserves control over event bubbling using `stopPropagation`
-  Reduces duplicated outside-click handling logic throughout the app

## Parameters

| Parameter |              Type              | Required | Default Value | Description                                      |
| --------- | :----------------------------: | :------: | :-----------: | ------------------------------------------------ |
| target    | [EvTarget](#type-definitions)  |    ❌    |       -       | Function that returns the target element or null |
| handler   | [EvHandler](#type-definitions) |    ❌    |   undefined   | Callback executed on outside click               |
| options   | [EvOptions](#type-definitions) |    ❌    |   undefined   | Event listener options and feature flags         |

### Standard AddEventListenerOptions

| Property | Type        | Default   | Description                                                                      |
| -------- | ----------- | --------- | -------------------------------------------------------------------------------- |
| capture  | boolean     | false     | Always `false`. Events are handled during the bubbling phase                     |
| once     | boolean     | false     | If `true`, the listener will be automatically removed after being triggered once |
| passive  | boolean     | false     | If `true`, indicates that the function will never call `preventDefault()`        |
| signal   | AbortSignal | undefined | An AbortSignal that can be used to remove the event listener                     |

### Custom Options

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
   capture?: boolean // Always overridden to false internally
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

| Property      | Type                      | Description                                                        |
| ------------- | ------------------------- | ------------------------------------------------------------------ |
| setElementRef | [Function](#return-types) | A ref callback that observes the target element for outside clicks |

## Common Use Cases

-  Modal dialogs — close when clicking the backdrop
-  Dropdown menus — hide when clicking elsewhere
-  Context menus — dismiss on outside click

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
      return (
         <button
            onClick={(e) => {
               e.stopPropagation()
               setIsOpen(true)
            }}
         >
            Open Modal
         </button>
      )
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
