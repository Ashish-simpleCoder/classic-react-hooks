---
outline: deep
---

# use-debounced-fn

A React hook that returns a debounced version of any function, delaying its execution until after a specified delay has passed since the last time it was invoked.

## Features

-  **Auto cleanup:** Timeouts are automatically cleared on unmount or dependency changes
-  **Flexible delay:** Configurable delay with sensible defaults
-  **Performance Optimized:** Prevents excessive function calls during rapid user interactions
-  **Error handling:** Preserves original function's error behavior

::: tip
The `debounced function` is purely ref based and does not change across re-renders.
:::

## Problem It Solves

::: details **Boilerplate Reduction**

---

**Problem:-** Manually implementing debouncing in React components leads to lengthy, error-prone code with potential memory leaks and stale closures.

```tsx
// ❌ Problematic approach which is redundant and lengthy
function SearchInput() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])
   const timeoutRef = useRef<NodeJS.Timeout>()

   const handleSearch = useCallback(async (searchTerm: string) => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(async () => {
         try {
            if (searchTerm.trim()) {
               const response = await fetch(`/api/search?q=${searchTerm}`)
               const data = await response.json()
               setResults(data.results)
            }
         } catch (error) {
            console.error('Search failed:', error)
         }
      }, 500)
   }, [])

   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current) // Manual cleanup on unmount
         }
      }
   }, [])

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      handleSearch(value)
   }

   return <input value={query} onChange={handleInputChange} placeholder='Search...' />
}
```

---

**Solution:-**

-  Eliminates repetitive debounce timing logic
-  Automatic cleanup ensures timeouts are cleared when:
   -  Component unmounts
   -  Delay value changes
   -  Function reference changes

```tsx
// ✅ Clean, declarative approach
function SearchInput() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const debouncedSearch = useDebouncedFn({
      callbackToBounce: async (searchTerm: string) => {
         if (searchTerm.trim()) {
            const response = await fetch(`/api/search?q=${searchTerm}`)
            const data = await response.json()
            setResults(data.results)
         }
      },
      delay: 500,
   })

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      debouncedSearch(value)
   }

   return <input value={query} onChange={handleInputChange} placeholder='Search...' />
}
```

:::

::: details **Performance Benefits**

-  **Reduces execution frequency:** Limits function calls during rapid user input
-  **Memory efficient:** Proper cleanup prevents memory leaks from pending timeouts
-  **Stable references:** Function reference remains stable across re-renders

:::

## Parameters

| Parameter        |               Type               | Required | Default Value | Description                                     |
| ---------------- | :------------------------------: | :------: | :-----------: | ----------------------------------------------- |
| callbackToBounce | [DebouncedFn](#type-definitions) |    ✅    |       -       | The function to debounce                        |
| delay            |              number              |    ❌    |     300ms     | Delay in milliseconds before function execution |

### Type Definitions

::: details

```ts
export type DebouncedFn<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void
```

:::

## Return Value(s)

The hook returns a debounced version of the provided callback.

| Return Value  | Type                               | Description                                                                             |
| ------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| `debouncedFn` | `(...args: Parameters<T>) => void` | Debounced version of the original function that delays execution by the specified delay |

## Common Use Cases

-  **Search functionality:** Debouncing search queries to reduce API calls
-  **API rate limiting:** Preventing excessive API requests

## Usage Examples

### Basic Search Debouncing

```tsx {8-19}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function SearchExample() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const debouncedSearch = useDebouncedFn({
      callbackToBounce: async (searchTerm: string) => {
         if (searchTerm.trim()) {
            const response = await fetch(`https://api.example.com/search?q=${searchTerm}`)
            const data = await response.json()
            setResults(data.results)
         } else {
            setResults([])
         }
      },
      delay: 500,
   })

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setQuery(value)
      debouncedSearch(value)
   }

   return (
      <div>
         <input value={query} onChange={handleInputChange} placeholder='Search products...' />
         <div>
            {results.map((result) => (
               <div key={result.id}>{result.name}</div>
            ))}
         </div>
      </div>
   )
}
```
