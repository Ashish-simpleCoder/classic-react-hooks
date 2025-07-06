---
outline: deep
---

# use-outside-click

A React hook that detects outside click for specified element and triggers the given callback.

Perfect for implementing modals, dropdowns and other UI components that need to be closed when users click outside of them.

## Features

-  **Precise trigger:** Precise outside click detection
-  **Performance:** Optimized with capture phase events
-  **Underlying hook:** At its core, it uses `useEventListener` hook

## Parameters

| Parameter |        Type         | Required | Default Value | Description                                      |
| --------- | :-----------------: | :------: | :-----------: | ------------------------------------------------ |
| target    | [EvTarget](#types)  |    ✅    |       -       | Function that returns the target element or null |
| handler   | [EvHandler](#types) |    ❌    |   undefined   | Callback executed on outside click               |
| options   | [EvOptions](#types) |    ❌    |   undefined   | Event listener options and feature flags         |

### Types

```ts
type EvTarget = () => EventTarget | null
type EvHandler = (event: DocumentEventMap['click']) => void
interface EvOptions extends AddEventListenerOptions {
   // Standard AddEventListenerOptions:
   // capture?: boolean
   // once?: boolean
   // passive?: boolean
   // signal?: AbortSignal

   // Custom option:
   shouldInjectEvent?: boolean | any // Controls whether the event should be attached
}
```

## Usage Examples

### Modal Component

```ts
import { useRef, useState } from 'react'
import { useOutsideClick } from 'classic-react-hooks'

function Modal() {
   const [isOpen, setIsOpen] = useState(false)
   const modalRef = useRef<HTMLDivElement>(null)

   useOutsideClick({
      target: () => modalRef.current,
      handler: () => setIsOpen(false),
   })

   if (!isOpen) {
      return <button onClick={() => setIsOpen(true)}>Open Modal</button>
   }

   return (
      <div className='modal-overlay'>
         <div ref={modalRef} class='modal-content bg-white p-8 rounded-lg shadow-md'>
            <h2>Modal Title</h2>
            <p>Click outside this modal to close it.</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
         </div>
      </div>
   )
}
```

#### Conditional Outside Click

```ts
function ConditionalOutsideClick() {
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [isPinned, setIsPinned] = useState(false)
   const modalRef = useRef<HTMLDivElement>(null)

   useOutsideClick({
      target: () => modalRef.current,
      handler: () => {
         // Only close if not pinned
         if (!isPinned) {
            setIsModalOpen(false)
         }
      },
   })

   return (
      <div>
         {isModalOpen && (
            <div ref={modalRef}>
               <button onClick={() => setIsPinned(!isPinned)}>{isPinned ? 'Unpin' : 'Pin'} Modal</button>
               <p>Modal content</p>
            </div>
         )}
      </div>
   )
}
```

#### Dynamic Target

```ts
function DynamicTarget() {
   const [activeElement, setActiveElement] = useState<HTMLElement | null>(null)

   useOutsideClick({
      target: () => activeElement,
      handler: () => {
         console.log('Clicked outside active element')
         setActiveElement(null)
      },
   })

   const makeActive = (element: HTMLElement) => {
      setActiveElement(element)
   }

   return (
      <div>
         <div onClick={(e) => makeActive(e.currentTarget)} className='p-5 bg-gray-100 m-2.5'>
            Click to make active
         </div>
      </div>
   )
}
```

## Common Use Cases

-  Modal dialogs - Close when clicking backdrop
-  Dropdown menus - Hide when clicking elsewhere
-  Context menus - Dismiss on outside click
