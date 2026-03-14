---
outline: deep
---

# use-debounced-fn

_`use-debounced-fn`_ is an async-aware React hook that provides a powerful, declarative way to implement debouncing with full lifecycle control.

It automatically manages timeouts and `AbortController`, ensuring stale async operations are safely cancelled when new calls occur or components unmount.

The hook supports immediate execution for synchronous UI updates, along with structured `onSuccess`, `onError`, and `onFinally` callbacks for robust async workflows. Its ref-based implementation guarantees a stable function reference across re-renders, eliminating stale closures and unnecessary rebindings. This makes it ideal for complex scenarios like search, validation, auto-save, and any debounced async side effects.

## Features

-  **Automatic cleanup:** Timeouts are cleared on unmount or dependency changes
-  **AbortSignal support:** Cancels pending async operations when a new call starts
-  **Configurable delay:** Flexible timing with sensible defaults
-  **Immediate execution:** Run synchronous logic before debouncing
-  **Success handler:** Invoke a callback on successful completion (async supported)
-  **Error handler:** Gracefully handle execution errors
-  **Finally handler:** Run cleanup logic regardless of outcome
-  **Manual cleanup:** Exposed cleanup function for advanced use cases
-  **Type-safe overloads:** Full TypeScript support for events and multiple arguments

## Problem It Solves

::: details **Boilerplate Reduction and More control on behaviors**

---

**Problem:-** Manually implementing debouncing in React components leads to less control on behaviors, lengthy, error-prone code with potential memory leaks and stale closures. Additionally, handling request cancellation requires manual AbortController management.

```tsx
// ❌ Problematic approach which is redundant and lengthy
function SearchInput() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])
   const timeoutRef = useRef<NodeJS.Timeout>()
   const controllerRef = useRef<AbortController>()

   const handleSearch = useCallback(async (searchTerm: string) => {
      // Cancel previous request
      if (controllerRef.current) {
         controllerRef.current.abort()
      }

      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current)
      }

      controllerRef.current = new AbortController()
      const controller = controllerRef.current

      timeoutRef.current = setTimeout(async () => {
         try {
            if (searchTerm.trim()) {
               const response = await fetch(`/api/search?q=${searchTerm}`, {
                  signal: controller.signal,
               })
               const data = await response.json()
               setResults(data.results)
            }
         } catch (error) {
            if (error.name !== 'AbortError') {
               console.error('Search failed:', error)
            }
         }
      }, 500)
   }, [])

   useEffect(() => {
      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
         }
         if (controllerRef.current) {
            controllerRef.current.abort()
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
-  Automatic AbortController management - previous requests are automatically cancelled
-  Eliminates manual management of custom callback for updating the UI state
-  Providing full flexibility on debouncing life cycle behavior with `immediateCallback`, `onSuccess`, `onError`, `onFinally` and `callbackToBounce` functions.
-  Automatic cleanup ensures timeouts and requests are cancelled when:
   -  Component unmounts
   -  Delay value changes
   -  New debounced call is triggered

```tsx {8,11,14,18,21,24}
// ✅ Clean, declarative approach with automatic abort handling
function SearchInput() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const { debouncedFn } = useDebouncedFn<string>({
      /* searchTerm is type-safe for all of the callbacks. */
      immediateCallback: (searchTerm) => {
         setQuery(searchTerm) // Update UI immediately
      },
      callbackToBounce: async (signal, searchTerm) => {
         // signal is automatically provided - use it in fetch!
         if (searchTerm.trim()) {
            const response = await fetch(`/api/search?q=${searchTerm}`, { signal })
            const data = await response.json()
            setResults(data.results)
         }
      },
      onSuccess: (searchTerm) => {
         console.log('runs after successful completion of callbackToBounce')
      },
      onError: (error, searchTerm) => {
         // AbortError is automatically filtered out - only real errors trigger this
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
-  **Automatic request cancellation:** Prevents race conditions by aborting stale requests
-  **Memory efficient:** Proper cleanup prevents memory leaks from pending timeouts and requests
-  **Stable references:** Function reference remains stable across re-renders
-  **Immediate UI updates:** `immediateCallback` ensures responsive user experience
-  **Async-aware:** `onSuccess` waits for async operations to complete
-  **Error resilience:** `onError` handles failures gracefully (AbortError is automatically filtered out)

:::

## AbortSignal Support

The hook automatically manages AbortController for you. The `callbackToBounce` function receives an AbortSignal as its first parameter, which you can pass to `fetch()` or other abortable operations.

**Key behaviors:**

-  When a new debounced call is triggered, the previous async operation is automatically aborted
-  `AbortError` exceptions are automatically filtered out and won't trigger `onError`
-  Only real errors (network failures, API errors, etc.) will trigger the `onError` callback
-  On component unmount, all pending operations are aborted

```tsx
const { debouncedFn } = useDebouncedFn({
   callbackToBounce: async (signal, searchTerm) => {
      // ✅ Pass signal to fetch
      const response = await fetch(`/api/search?q=${searchTerm}`, { signal })
      const data = await response.json()
      return data
   },
   onError: (error, searchTerm) => {
      // ✅ This will NOT be called for AbortError
      // Only called for real errors (network issues, 500 errors, etc.)
      console.error('Real error occurred:', error)
   },
})
```

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
      callbackToBounce: async (signal, searchTerm) => {
         // No try-catch needed for AbortError
         // Error is handled within `onError` callback (except AbortError)
         const response = await fetch(`/api/search?q=${searchTerm}`, { signal })
         const data = await response.json()
         setResults(data.results)
      },
      onSuccess: (searchTerm) => {
         console.log('runs after successful completion of callbackToBounce')
      },
      onError: (error, searchTerm) => {
         console.log('runs if error occurs (AbortError filtered out)', error)
      },
      onFinally: (searchTerm) => {
         console.log('runs after all of the callbacks (even on abort)')
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
2. **callbackToBounce** - Executes after the delay period (receives AbortSignal as first parameter)
3. **onSuccess** - Executes after `callbackToBounce` completes successfully
4. **onFinally** - Executes after `onSuccess`

### Error Flow

1. **immediateCallback** - Executes synchronously when `debouncedFn` is called
2. **callbackToBounce** - Executes after the delay period and throws an error
3. **onError** - Executes when error is caught (receives the error and all arguments) - **AbortError is automatically filtered out**
4. **onFinally** - Executes after `onError`

### Abort Flow

1. **immediateCallback** - Executes synchronously when `debouncedFn` is called
2. **callbackToBounce** - Starts executing after delay, but gets aborted
3. **onError** - Does NOT execute (AbortError is filtered)
4. **onFinally** - Still executes

::: tip

-  `onSuccess` and `onError` are mutually exclusive - only one will run per execution
-  `onFinally` always runs, regardless of success, error, or abort
-  All callbacks except `onError` receive the same arguments passed to `debouncedFn`
-  `onError` receives the error as the first argument, followed by the original arguments
-  **`callbackToBounce` receives AbortSignal as the first parameter, followed by the arguments**
-  AbortError is automatically filtered and won't trigger `onError`
   :::

::: tip
The `debounced function` is purely ref based and does not change across re-renders.
:::

## Parameters

| Parameter         |               Type               | Required | Default Value | Description                                                                     |
| ----------------- | :------------------------------: | :------: | :-----------: | ------------------------------------------------------------------------------- |
| callbackToBounce  | [DebouncedFn](#type-definitions) |    ✅    |       -       | The function to debounce (receives AbortSignal as first parameter)              |
| immediateCallback | [DebouncedFn](#type-definitions) |    ❌    |       -       | Function to execute immediately before debouncing starts                        |
| onSuccess         | [DebouncedFn](#type-definitions) |    ❌    |       -       | Function to execute after debounced callback completes successfully             |
| onError           |   [ErrorFn](#type-definitions)   |    ❌    |       -       | Function to execute when debounced callback throws an error (except AbortError) |
| onFinally         | [DebouncedFn](#type-definitions) |    ❌    |       -       | Function to execute after completion (success, error, or abort)                 |
| delay             |              number              |    ❌    |     300ms     | Delay in milliseconds before function execution                                 |

### Type Definitions

::: details

```ts
export type DebouncedFn<T extends (...args: any[]) => any> = (signal: AbortSignal, ...args: Parameters<T>) => void
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
   callbackToBounce: (signal: AbortSignal, ...args: any[]) => void
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
   callbackToBounce: (signal: AbortSignal, ev: Ev, ...args: Args) => void
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
| `cleanup`     | `() => void`                       | Manual cleanup function to clear pending timeouts and abort pending requests            |

## Common Use Cases

-  **Search functionality:** Debouncing search queries to reduce API calls with automatic request cancellation, immediate UI updates, and error handling
-  **API rate limiting:** Preventing excessive API requests with proper error handling and request cancellation
-  **Form validation:** Debouncing validation with loading states, error feedback, and automatic abort of stale validations
-  **Auto-save:** Debouncing save operations with completion callbacks, error recovery, and request cancellation
-  **Resize/scroll handlers:** Optimizing expensive DOM operations with error boundaries

## Usage Examples

### Basic Search with AbortSignal

```tsx {8-24}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function SearchExample() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const { debouncedFn } = useDebouncedFn({
      immediateCallback: (searchTerm: string) => {
         setQuery(searchTerm) // Update input immediately
      },
      callbackToBounce: async (signal, searchTerm: string) => {
         if (searchTerm.trim()) {
            // Pass signal to fetch - request will be automatically cancelled
            // if user types again before this completes
            const response = await fetch(`https://api.example.com/search?q=${searchTerm}`, {
               signal,
            })
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

### Auto-save with Loading State and Request Cancellation

```tsx {7-37}
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
      callbackToBounce: async (signal, text: string) => {
         setIsSaving(true)
         // Previous save request will be automatically cancelled
         const response = await fetch('/api/save', {
            method: 'POST',
            body: JSON.stringify({ content: text }),
            signal, // Pass the signal
         })
         if (!response.ok) throw new Error('Save failed')
      },
      onSuccess: () => {
         setLastSaved(new Date())
      },
      onError: (err) => {
         // AbortError won't trigger this - only real errors
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

### Form Validation with Status Tracking and Abort

```tsx {7-41}
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
      callbackToBounce: async (signal, value: string) => {
         if (value.length < 3) return

         setIsValidating(true)
         // Previous validation will be automatically cancelled
         const response = await fetch(`/api/check-username?name=${value}`, {
            signal,
         })
         if (!response.ok) throw new Error('Validation failed')
         const data = await response.json()
         setIsAvailable(data.available)
      },
      onError: (err) => {
         // Only real errors trigger this (not AbortError)
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

```tsx {8-21,27}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function SearchWithCancel() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const { debouncedFn, cleanup } = useDebouncedFn({
      callbackToBounce: async (signal, searchTerm: string) => {
         const response = await fetch(`/api/search?q=${searchTerm}`, {
            signal,
         })
         const data = await response.json()
         setResults(data.results)
      },
      delay: 500,
   })

   const handleClear = () => {
      setQuery('')
      setResults([])
      cleanup() // Cancel pending timeout AND abort any in-flight request
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

### Type-safe Event Handling with AbortSignal

```tsx {8-26}
import { useDebouncedFn } from 'classic-react-hooks'

export default function TypeSafeExample() {
   const { debouncedFn } = useDebouncedFn<React.ChangeEvent<HTMLInputElement>>({
      immediateCallback: (event) => {
         console.log('Immediate:', event.target.value)
      },
      callbackToBounce: async (signal, event) => {
         // Full type safety for signal and event object
         const response = await fetch(`/api/process?value=${event.target.value}`, {
            signal,
         })
         const data = await response.json()
         console.log('Debounced:', data)
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

```tsx {7-47}
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
      callbackToBounce: async (signal, searchTerm) => {
         // 2. Runs after delay (debounced)
         setIsLoading(true)
         console.log('Searching for:', searchTerm)

         // Previous request is automatically aborted when new one starts
         const response = await fetch(`/api/search?q=${searchTerm}`, {
            signal,
         })
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
         // Note: AbortError is filtered out automatically
         console.error('Search failed for:', searchTerm, err)
         setError(err.message)
         setResults([])
      },
      onFinally: (searchTerm) => {
         // 4. Always runs at the end (even after abort)
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

### Custom Abortable Operation

```tsx {7-30}
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function CustomAbortExample() {
   const [result, setResult] = useState<string>('')

   const { debouncedFn } = useDebouncedFn({
      callbackToBounce: async (signal, value: string) => {
         // You can use the signal for custom abort logic
         return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
               resolve(`Processed: ${value}`)
            }, 2000)

            // Listen to abort signal
            signal.addEventListener('abort', () => {
               clearTimeout(timeoutId)
               reject(new DOMException('Aborted', 'AbortError'))
            })
         })
      },
      onSuccess: (value) => {
         setResult(`Success: ${value}`)
      },
      delay: 500,
   })

   return (
      <div>
         <input onChange={(e) => debouncedFn(e.target.value)} placeholder='Type to trigger...' />
         <div>{result}</div>
      </div>
   )
}
```

## Things to keep in mind

-  Always use the `signal` parameter in `callbackToBounce` for fetches and other abortable operations to avoid race conditions
-  Use `immediateCallback` for synchronous UI updates to keep interactions responsive
-  Use `onSuccess` to track successful async completion (e.g., loading states, success messages)
-  Use `onError` for graceful failure handling and user-facing errors — `AbortError` is filtered automatically
-  Use `onFinally` for cleanup logic that must run on success, failure, or abort (e.g., hiding spinners)
-  Use `cleanup` to cancel pending work and abort in-flight requests (navigation, unmounting)
-  No callback memoization required — no stale-closure issues
-  Built-in error handling removes the need for `try/catch` in `callbackToBounce`
-  Abort signals are managed automatically — previous operations are cancelled on new calls or unmount
