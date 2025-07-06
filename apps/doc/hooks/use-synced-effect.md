---
outline: deep
---

# use-synced-effect

A React hook that executes a callback when dependencies change, similar to `useEffect`, but skips execution on the initial mount.

This is particularly useful when you want to respond to state changes without triggering side effects during the component's first render.

## Features

-  **Skip initial mount:** Skipping the callback on initial mount
-  **Reactive:** Running the callback only when dependencies actually change
-  **React StrictMode:** Handling React StrictMode double execution correctly
-  **Flexible:** Supporting cleanup functions just like useEffect

## Parameters

| Parameter |         Type         | Required | Default Value | Description                                                                          |
| --------- | :------------------: | :------: | :-----------: | ------------------------------------------------------------------------------------ |
| cb        | React.EffectCallback |    ✅    |       -       | Callback function to execute when dependencies change. Can return a cleanup function |
| deps      | React.DependencyList |    ❌    |      []       | Array of dependencies to watch for changes                                           |

## Usage Examples

### Basic Usage - Responding to State Changes

```ts
import { useState } from 'react'
import { useSyncedEffect } from 'classic-react-hooks'

export default function YourComponent() {
   const [counter, setCounter] = useState(0)

   useSyncedEffect(() => {
      console.log('counter changed to ', counter)
   }, [counter])

   return (
      <div>
         <button onClick={() => setCounter((c) => c + 1)}>increment</button>
      </div>
   )
}
```

### With Cleanup Function

```ts
import { useState } from 'react'
import { useSyncedEffect } from 'classic-react-hooks'

function SearchComponent() {
   const [query, setQuery] = useState('')

   useSyncedEffect(() => {
      // Only search when query actually changes, not on initial empty string
      if (query) {
         const controller = new AbortController()

         fetch(`/api/search?q=${query}`, {
            signal: controller.signal,
         })
            .then((response) => response.json())
            .then((data) => {
               // Handle search results
            })

         // Cleanup function to cancel the request
         return () => {
            controller.abort()
         }
      }
   }, [query])

   return <input type='text' value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Search...' />
}
```

## Comparison with useEffect

| Scenario            | useEffect        | useSyncedEffect      |
| ------------------- | ---------------- | -------------------- |
| Initial mount       | ✅ Runs          | ❌ Skips             |
| Dependency changes  | ✅ Runs          | ✅ Runs              |
| Cleanup support     | ✅ Yes           | ✅ Yes               |
| StrictMode handling | ⚠️ May run twice | ✅ Handles correctly |

## Important notes

-  Empty dependency array [] means the effect will never run (since there are no dependencies to change)

## Common Use Cases

-  Use everywhere just like `useEffect`
