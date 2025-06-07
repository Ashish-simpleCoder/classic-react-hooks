---
outline: deep
---

# use-synced-ref

-  A React hook that creates a ref that automatically stays in sync with the provided value.
-  This eliminates the need to manually update refs and helps avoid stale closure issues in callbacks and effects.

### Features

-  **Reactive:** Automatic synchronization with any value
-  **Prevent State Closure:**Prevents stale closure problems
-  **No Re-render:**Zero re-renders - purely ref-based

### Parameters

| Parameter | Type | Required | Default Value | Description                                       |
| --------- | :--: | :------: | :-----------: | ------------------------------------------------- |
| value     | any  |    ✅    |       -       | Any value to be tracked and kept in sync with ref |

### Returns

-  Returns a `React.MutableRefObject<T>` that always contains the latest value of the provided state.

### Usage

#### Basic Example

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

### Problem It Solves

#### The Stale Closure Problem

In React, when you use hooks like useEffect, useCallback, or setTimeout with dependency arrays, you often encounter stale closure issues:

```ts
// ❌ Problematic code
function ProblematicComponent() {
   const [count, setCount] = useState(0)

   useEffect(() => {
      const interval = setInterval(() => {
         console.log(count) // Always logs 0 (stale closure)
      }, 1000)
      return () => clearInterval(interval)
   }, []) // Empty deps = stale closure

   // vs

   useEffect(() => {
      const interval = setInterval(() => {
         console.log(count) // Works but recreates interval on every count change
      }, 1000)
      return () => clearInterval(interval)
   }, [count]) // Including count fixes staleness but causes recreation
}

// ✅ Solution with useSyncedRef
function SolvedComponent() {
   const [count, setCount] = useState(0)
   const countRef = useSyncedRef(count)

   useEffect(() => {
      const interval = setInterval(() => {
         console.log(countRef.current) // Always logs latest count
      }, 1000)
      return () => clearInterval(interval)
   }, []) // Empty deps = no recreation, no staleness!
}
```

### Common Use Cases

-  Accessing latest state in intervals/timeouts
-  Event handlers that need current state
-  Custom hooks with complex state dependencies
-  Preventing effect recreations while avoiding stale closures
