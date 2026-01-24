---
outline: deep
---

# use-debounced-fn

An async aware React hook with features like built-in error handling and success/finally callbacks which completely transforms the way you implement debouncing feature in your application.

## Features

-  **Auto cleanup:** Timeouts are automatically cleared on unmount or dependency changes
-  **Flexible delay:** Configurable delay with sensible defaults
-  **Immediate Callback:** Execute synchronous logic immediately before debouncing
-  **Success Callback:** Run callback after debounced function completes successfully (supports async)
-  **Error Callback:** Handle errors from debounced function execution
-  **Finally Callback:** Execute cleanup logic that runs regardless of success or failure
-  **Manual Cleanup:** Exposed cleanup function for advanced control
-  **Type-safe Overloads:** Full TypeScript support for events and multiple arguments

## Execution Flow for the callbacks

```tsx
function SearchInput() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const { debouncedFn } = useDebouncedFn<string>({
      /* searchTerm is type-safe for all of the callbacks. */
      immediateCallback: (searchTerm) => {
         setQuery(searchTerm) /* Update UI immediately */
      },
      callbackToBounce: async (searchTerm) => {
         // No try-catch needed
         // Error is handled within `onError` callback
         const response = await fetch(`/api/search?q=${searchTerm}`)
         const data = await response.json()
         setResults(data.results)
      },
      onSuccess: (searchTerm) => {
         console.log('runs after successful completion of callbackToBounce')
      },
      onError: (error, searchTerm) => {
         console.log('runs if error occurs', error)
      },
      onFinally: (searchTerm) => {
         console.log('runs after all of the callbacks')
      },
   })

   /* debouncedFn is aware of its type. String argument must be provided. */
   return <input value={query} onChange={(e) => debouncedFn(e.target.value)} placeholder='Search...' />
}
```

## Callback Execution Order

The callbacks execute in the following order:

### Success Flow

1. **immediateCallback** - Executes synchronously when `debouncedFn` is called
2. **callbackToBounce** - Executes after the delay period
3. **onSuccess** - Executes after `callbackToBounce` completes successfully
4. **onFinally** - Executes after `onSuccess`

### Error Flow

1. **immediateCallback** - Executes synchronously when `debouncedFn` is called
2. **callbackToBounce** - Executes after the delay period and throws an error
3. **onError** - Executes when error is caught (receives the error and all arguments)
4. **onFinally** - Executes after `onError`

::: tip

-  `onSuccess` and `onError` are mutually exclusive - only one will run per execution
-  `onFinally` always runs, regardless of success or error
-  All callbacks except `onError` receive the same arguments passed to `debouncedFn`
-  `onError` receives the error as the first argument, followed by the original arguments
   :::

::: tip
The `debounced function` is purely ref based and does not change across re-renders.
:::

## Problem It Solves

::: details **Boilerplate Reduction and More control on behaviors**

---

**Problem:-** Manually implementing debouncing in React components leads to less control on behaviors, lengthy, error-prone code with potential memory leaks and stale closures.

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
-  Eliminates manual management of custom callback for updating the UI state
-  Providing full flexibility on debouncing life cycle behavior with `immediateCallback`, `onSuccess`, `onError`, `onFinally` and `callbackToBounce` functions.
-  Automatic cleanup ensures timeouts are cleared when:
   -  Component unmounts
   -  Delay value changes

```tsx {8,11,18,21,24}
// ✅ Clean, declarative approach
function SearchInput() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const { debouncedFn } = useDebouncedFn<string>({
      /* searchTerm is type-safe for all of the callbacks. */
      immediateCallback: (searchTerm) => {
         setQuery(searchTerm) // Update UI immediately
      },
      callbackToBounce: async (searchTerm) => {
         if (searchTerm.trim()) {
            const response = await fetch(`/api/search?q=${searchTerm}`)
            const data = await response.json()
            setResults(data.results)
         }
      },
      onSuccess: (searchTerm) => {
         console.log('runs after successful completion of callbackToBounce')
      },
      onError: (error, searchTerm) => {
         console.error('Search failed:', error)
      },
      delay: 500,
   })

   /* debouncedFn is aware of its type. String argument must be provided. */
   return <input value={query} onChange={(e) => debouncedFn(e.target.value)} placeholder='Search...' />
}
```

:::

::: details **Performance Benefits**

-  **Reduces execution frequency:** Limits function calls during rapid user input
-  **Memory efficient:** Proper cleanup prevents memory leaks from pending timeouts
-  **Stable references:** Function reference remains stable across re-renders
-  **Immediate UI updates:** `immediateCallback` ensures responsive user experience
-  **Async-aware:** `onSuccess` waits for async operations to complete
-  **Error resilience:** `onError` handles failures gracefully without breaking the UI

:::

## Parameters

| Parameter         |               Type               | Required | Default Value | Description                                                         |
| ----------------- | :------------------------------: | :------: | :-----------: | ------------------------------------------------------------------- |
| callbackToBounce  | [DebouncedFn](#type-definitions) |    ✅    |       -       | The function to debounce                                            |
| immediateCallback | [DebouncedFn](#type-definitions) |    ❌    |       -       | Function to execute immediately before debouncing starts            |
| onSuccess         | [DebouncedFn](#type-definitions) |    ❌    |       -       | Function to execute after debounced callback completes successfully |
| onError           |   [ErrorFn](#type-definitions)   |    ❌    |       -       | Function to execute when debounced callback throws an error         |
| onFinally         | [DebouncedFn](#type-definitions) |    ❌    |       -       | Function to execute after completion (success or error)             |
| delay             |              number              |    ❌    |     300ms     | Delay in milliseconds before function execution                     |

### Type Definitions

::: details

```ts
export type DebouncedFn<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void
export type ErrorFn<T extends (...args: any[]) => any> = (error: Error, ...args: Parameters<T>) => void

// Function overloads for type safety
export function useDebouncedFn({
   immediateCallback,
   callbackToBounce,
   onSuccess,
   onError,
   onFinally,
   delay,
}: {
   immediateCallback?: (...args: any[]) => void
   callbackToBounce: (...args: any[]) => void
   onSuccess?: (...args: any[]) => void
   onError?: (error: Error, ...args: any[]) => void
   onFinally?: (...args: any[]) => void
   delay?: number
}): {
   debouncedFn: (...args: any[]) => void
   cleanup: () => void
}

// Overload with event and additional arguments
export function useDebouncedFn<Ev, Args extends any[] = any[]>({
   immediateCallback,
   callbackToBounce,
   onSuccess,
   onError,
   onFinally,
   delay,
}: {
   immediateCallback?: (ev: Ev, ...args: Args) => void
   callbackToBounce: (ev: Ev, ...args: Args) => void
   onSuccess?: (ev: Ev, ...args: Args) => void
   onError?: (error: Error, ev: Ev, ...args: Args) => void
   onFinally?: (ev: Ev, ...args: Args) => void
   delay?: number
}): {
   debouncedFn: (ev: Ev, ...args: Args) => void
   cleanup: () => void
}
```

:::

## Return Value(s)

The hook returns an object with the debounced function and a cleanup function.

| Return Value  | Type                               | Description                                                                             |
| ------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| `debouncedFn` | `(...args: Parameters<T>) => void` | Debounced version of the original function that delays execution by the specified delay |
| `cleanup`     | `() => void`                       | Manual cleanup function to clear pending timeouts                                       |

## Common Use Cases

-  **Search functionality:** Debouncing search queries to reduce API calls with immediate UI updates and error handling
-  **API rate limiting:** Preventing excessive API requests with proper error handling
-  **Form validation:** Debouncing validation with loading states and error feedback
-  **Auto-save:** Debouncing save operations with completion callbacks and error recovery
-  **Resize/scroll handlers:** Optimizing expensive DOM operations with error boundaries

## Usage Examples

### Basic Search with Immediate UI Update

```tsx {8-21}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function SearchExample() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const { debouncedFn } = useDebouncedFn({
      immediateCallback: (searchTerm: string) => {
         setQuery(searchTerm) // Update input immediately
      },
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

   return (
      <div>
         <input value={query} onChange={(e) => debouncedFn(e.target.value)} placeholder='Search products...' />
         <div>
            {results.map((result) => (
               <div key={result.id}>{result.name}</div>
            ))}
         </div>
      </div>
   )
}
```

### Auto-save with Loading State and Error Handling

```tsx {7-34}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function AutoSaveEditor() {
   const [content, setContent] = useState('')
   const [isSaving, setIsSaving] = useState(false)
   const [lastSaved, setLastSaved] = useState<Date | null>(null)
   const [error, setError] = useState<string | null>(null)

   const { debouncedFn } = useDebouncedFn({
      immediateCallback: (text: string) => {
         setContent(text) // Update editor immediately
         setError(null) // Clear previous errors
      },
      callbackToBounce: async (text: string) => {
         setIsSaving(true)
         const response = await fetch('/api/save', {
            method: 'POST',
            body: JSON.stringify({ content: text }),
         })
         if (!response.ok) throw new Error('Save failed')
      },
      onSuccess: () => {
         setLastSaved(new Date())
      },
      onError: (err) => {
         setError(err.message)
      },
      onFinally: () => {
         setIsSaving(false)
      },
      delay: 1000,
   })

   return (
      <div>
         <textarea value={content} onChange={(e) => debouncedFn(e.target.value)} />
         <div>
            {isSaving && 'Saving...'}
            {error && <span style={{ color: 'red' }}>{error}</span>}
            {!isSaving && !error && lastSaved && `Last saved: ${lastSaved.toLocaleTimeString()}`}
         </div>
      </div>
   )
}
```

### Form Validation with Status Tracking

```tsx {7-38}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function UsernameValidator() {
   const [username, setUsername] = useState('')
   const [isValidating, setIsValidating] = useState(false)
   const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
   const [error, setError] = useState<string | null>(null)

   const { debouncedFn } = useDebouncedFn({
      immediateCallback: (value: string) => {
         setUsername(value)
         setIsAvailable(null) // Reset validation state
         setError(null)
      },
      callbackToBounce: async (value: string) => {
         if (value.length < 3) return

         setIsValidating(true)
         const response = await fetch(`/api/check-username?name=${value}`)
         if (!response.ok) throw new Error('Validation failed')
         const data = await response.json()
         setIsAvailable(data.available)
      },
      onError: (err) => {
         setError(err.message)
         setIsAvailable(null)
      },
      onFinally: () => {
         setIsValidating(false)
      },
      delay: 600,
   })

   return (
      <div>
         <input value={username} onChange={(e) => debouncedFn(e.target.value)} placeholder='Enter username' />
         {isValidating && <span>Checking...</span>}
         {error && <span style={{ color: 'red' }}>{error}</span>}
         {isAvailable !== null && <span>{isAvailable ? '✓ Available' : '✗ Taken'}</span>}
      </div>
   )
}
```

### Manual Cleanup Example

```tsx {8-18,24}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function SearchWithCancel() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const { debouncedFn, cleanup } = useDebouncedFn({
      callbackToBounce: async (searchTerm: string) => {
         const response = await fetch(`/api/search?q=${searchTerm}`)
         const data = await response.json()
         setResults(data.results)
      },
      delay: 500,
   })

   const handleClear = () => {
      setQuery('')
      setResults([])
      cleanup() // Cancel any pending debounced calls
   }

   return (
      <div>
         <input value={query} onChange={(e) => debouncedFn(e.target.value)} />
         <button onClick={handleClear}>Clear</button>
         <div>
            {results.map((result) => (
               <div key={result.id}>{result.name}</div>
            ))}
         </div>
      </div>
   )
}
```

### Type-safe Event Handling

```tsx {8-23}
import { useDebouncedFn } from 'classic-react-hooks'

export default function TypeSafeExample() {
   const { debouncedFn } = useDebouncedFn<React.ChangeEvent<HTMLInputElement>>({
      immediateCallback: (event) => {
         console.log('Immediate:', event.target.value)
      },
      callbackToBounce: (event) => {
         // Full type safety for event object
         console.log('Debounced:', event.target.value)
      },
      onSuccess: (event) => {
         console.log('Completed for:', event.target.value)
      },
      onError: (error, event) => {
         console.error('Error processing:', event.target.value, error)
      },
      delay: 400,
   })

   return <input onChange={debouncedFn} placeholder='Type something...' />
}
```

### Complex Workflow with All Callbacks

```tsx {7-44}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function CompleteExample() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const { debouncedFn } = useDebouncedFn<string>({
      immediateCallback: (searchTerm) => {
         // 1. Runs immediately on every keystroke
         setQuery(searchTerm)
         setError(null)
         console.log('User typed:', searchTerm)
      },
      callbackToBounce: async (searchTerm) => {
         // 2. Runs after delay (debounced)
         setIsLoading(true)
         console.log('Searching for:', searchTerm)

         const response = await fetch(`/api/search?q=${searchTerm}`)
         if (!response.ok) throw new Error('Search failed')

         const data = await response.json()
         setResults(data.results)
      },
      onSuccess: (searchTerm) => {
         // 3. Runs after successful completion
         console.log('Search completed for:', searchTerm)
      },
      onError: (err, searchTerm) => {
         // 3. Runs if error occurs (instead of onSuccess)
         console.error('Search failed for:', searchTerm, err)
         setError(err.message)
         setResults([])
      },
      onFinally: (searchTerm) => {
         // 4. Always runs at the end
         setIsLoading(false)
         console.log('Finished processing:', searchTerm)
      },
      delay: 500,
   })

   return (
      <div>
         <input value={query} onChange={(e) => debouncedFn(e.target.value)} placeholder='Search...' />
         {isLoading && <div>Loading...</div>}
         {error && <div style={{ color: 'red' }}>{error}</div>}
         <div>
            {results.map((result) => (
               <div key={result.id}>{result.name}</div>
            ))}
         </div>
      </div>
   )
}
```

## Things to keep in mind

-  **Use `immediateCallback`** for synchronous UI updates to maintain responsive user experience
-  **Use `onSuccess`** when you need to track completion of async operations (loading states, success messages)
-  **Use `onError`** to handle failures gracefully and display error messages to users
-  **Use `onFinally`** for cleanup operations that should run regardless of success or failure (e.g., hiding loading spinners)
-  **Use `cleanup`** when you need to cancel pending operations (navigation, unmounting child components)
-  Keep the `delay` value reasonable (300-600ms for search, 1000-2000ms for auto-save)
-  No need to memoize the callbacks. No stale closures problems anymore.
-  Error handling is built-in - no need for try-catch blocks in `callbackToBounce` when using `onError`
