---
outline: deep
---

# use-synced-ref

A React hook that creates a ref that automatically stays in sync with the provided value, ensuring you always have access to the latest state in asynchronous operations.

## Features

-  **Always current:** Ref automatically updates to reflect the latest value
-  **Stale closure prevention:** Prevents accessing stale values in async operations
-  **Simple API:** Minimal interface with automatic synchronization
-  **Type safe:** Full TypeScript support with generic typing

## Problem It Solves

::: details **Stale Closure Problem**

---

**Problem:-** In React, when you capture state values in closures (like in `setTimeout`, event handlers, or async operations), you might get stale values due to how JavaScript closures work.

```tsx
// ❌ Problematic approach - stale closure issue
function Component() {
   const [count, setCount] = useState(0)

   const handleAsyncOperation = () => {
      setTimeout(() => {
         // This will always log the value of count when handleAsyncOperation was called
         // Not the current value after 2 seconds
         console.log('Stale count:', count) // Might be outdated!
      }, 2000)
   }

   return (
      <div>
         <p>Count: {count}</p>
         <button onClick={() => setCount((c) => c + 1)}>Increment</button>
         <button onClick={handleAsyncOperation}>Log count after 2s</button>
      </div>
   )
}
```

---

**Solution:-**

-  Provides a ref that always contains the current value
-  Eliminates stale closure issues in async operations
-  Ensures you can access the latest state regardless of when the closure was created

```tsx
// ✅ Clean approach with useSyncedRef
function Component() {
   const [count, setCount] = useState(0)
   const countRef = useSyncedRef(count)

   const handleAsyncOperation = () => {
      setTimeout(() => {
         // countRef.current always has the latest value
         console.log('Current count:', countRef.current) // Always up-to-date!
      }, 2000)
   }

   return (
      <div>
         <p>Count: {count}</p>
         <button onClick={() => setCount((c) => c + 1)}>Increment</button>
         <button onClick={handleAsyncOperation}>Log count after 2s</button>
      </div>
   )
}
```

:::

::: details **Performance Benefits**

-  Lightweight solution with minimal overhead
-  No unnecessary re-renders or effect dependencies
-  Simple ref assignment on every render ensures synchronization

:::

## Parameters

| Parameter | Type | Required | Default Value | Description                                 |
| --------- | :--: | :------: | :-----------: | ------------------------------------------- |
| state     |  T   |    ✅    |       -       | The value to keep synchronized with the ref |

## Return Value(s)

This hook returns the ref version of the provided state, which auto syncs up

| Return Value | Type          | Description                                                                           |
| ------------ | ------------- | ------------------------------------------------------------------------------------- |
| syncedRef    | RefObject<T\> | A mutable ref object whose `.current` property always contains the latest state value |

## Common Use Cases

-  **Async operations:** Accessing latest state in `setTimeout`, `setInterval`, or API calls
-  **Event handlers:** Ensuring event callbacks have access to current state without stale closures
-  **WebSocket handlers:** Accessing current state in WebSocket message handlers

## Usage Examples

### Basic State Synchronization

```ts
import { useState } from 'react'
import { useSyncedRef } from 'classic-react-hooks'

export default function Counter() {
   const [count, setCount] = useState(0)
   const countRef = useSyncedRef(count)

   const handleAsyncOperation = () => {
      setTimeout(() => {
         // countRef.current always has the latest value
         console.log('Current count:', countRef.current)
         alert(`Count is now: ${countRef.current}`)
      }, 2000)
   }

   return (
      <div>
         <p>Count: {count}</p>
         <button onClick={() => setCount((c) => c + 1)}>Increment</button>
         <button onClick={handleAsyncOperation}>Show count after 2 seconds</button>
      </div>
   )
}
```

### Event Handlers with Latest State

::: details Example

```ts {6,11}
import { useState, useCallback } from 'react'
import { useSyncedRef } from 'classic-react-hooks'

export default function EventExample() {
   const [messages, setMessages] = useState<string[]>([])
   const messagesRef = useSyncedRef(messages)

   const handleKeyPress = useCallback((event: KeyboardEvent) => {
      if (event.key === 'Enter') {
         // Always access the latest messages array
         const currentMessages = messagesRef.current
         console.log('Current messages count:', currentMessages.length)

         setMessages((prev) => [...prev, `Message ${prev.length + 1}`])
      }
   }, []) // No need to include messages in dependencies

   useEffect(() => {
      document.addEventListener('keydown', handleKeyPress)
      return () => document.removeEventListener('keydown', handleKeyPress)
   }, [handleKeyPress])

   return (
      <div>
         <p>Press Enter to add messages</p>
         <ul>
            {messages.map((msg, index) => (
               <li key={index}>{msg}</li>
            ))}
         </ul>
      </div>
   )
}
```

:::
