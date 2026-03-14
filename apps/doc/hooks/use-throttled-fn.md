---
outline: deep
---

# use-throttled-fn

_`use-throttled-fn`_ is a lightweight React hook that provides a stable, throttled version of any callback function.

It guarantees immediate execution on the first call and limits subsequent executions to at most once per configured time interval. The returned function is ref-based and remains unchanged across re-renders, avoiding unnecessary effect re-subscriptions.

It preserves the original function’s context and error behavior, making it safe for both synchronous and asynchronous workflows. This hook is especially useful for handling high-frequency events without sacrificing performance or readability.

## Features

-  **Rate limiting:** Ensures function executes at most once per specified interval
-  **Immediate Execution:** First call executes immediately, subsequent calls are throttled
-  **Performance Optimized:** Prevents excessive function calls during rapid user interactions
-  **Context preservation:** Maintains original function's `this` context and error behavior
-  **Error handling:** Preserves original function's error behavior

::: tip
The `throttled function` is purely ref based and does not change across re-renders.
:::

## Problem It Solves

::: details **Boilerplate Reduction**

---

**Problem:-** Manually implementing throttling in React components becomes lengthy, little bit complex code with potential performance issues and inconsistent behavior.

```tsx
// ❌ Problematic approach which is redundant and verbose
function ScrollTracker() {
   const [scrollPosition, setScrollPosition] = useState(0)
   const lastExecutionTimeRef = useRef(0)
   const THROTTLE_DELAY = 100

   const handleScroll = useCallback(() => {
      const currentTime = Date.now()

      if (currentTime - lastExecutionTimeRef.current >= THROTTLE_DELAY) {
         setScrollPosition(window.scrollY)
         lastExecutionTimeRef.current = currentTime

         // Additional complex logic for tracking scroll performance
         console.log('Scroll position updated:', window.scrollY)
      }
   }, [])

   useEffect(() => {
      const throttledScrollHandler = (event: Event) => {
         handleScroll()
      }

      window.addEventListener('scroll', throttledScrollHandler, { passive: true })

      return () => {
         window.removeEventListener('scroll', throttledScrollHandler)
      }
   }, [handleScroll])

   return <div>Current scroll: {scrollPosition}px</div>
}
```

---

**Solution:-**

-  Eliminates repetitive throttling logic
-  Automatic handling of:
   -  First call immediate execution
   -  Context preservation
   -  Error handling

```tsx
// ✅ Clean, declarative approach
function ScrollTracker() {
   const [scrollPosition, setScrollPosition] = useState(0)

   const throttledScrollHandler = useThrottledFn({
      callbackToThrottle: () => {
         setScrollPosition(window.scrollY)
         console.log('Scroll position updated:', window.scrollY)
      },
      delay: 100,
   })

   useEffect(() => {
      window.addEventListener('scroll', throttledScrollHandler, { passive: true })
      return () => window.removeEventListener('scroll', throttledScrollHandler)
   }, [throttledScrollHandler])

   return <div>Current scroll: {scrollPosition}px</div>
}
```

:::

::: details **Performance Benefits**

-  **Reduces execution frequency:** Limits function calls to specified intervals, preventing performance bottlenecks
-  **Memory efficient:** Minimal overhead with simple timestamp tracking

:::

## Throttling vs Debouncing

| Aspect               | Throttling                         | Debouncing                                 |
| -------------------- | ---------------------------------- | ------------------------------------------ |
| **Execution timing** | Executes at regular intervals      | Executes after inactivity period           |
| **First call**       | Executes immediately               | May delay first execution                  |
| **Use case**         | Continuous events (scroll, resize) | User input completion (search, validation) |
| **Frequency**        | Limited to X times per interval    | Executes only after pause                  |

## Parameters

| Parameter          |               Type               | Required | Default Value | Description                                                       |
| ------------------ | :------------------------------: | :------: | :-----------: | ----------------------------------------------------------------- |
| callbackToThrottle | [ThrottledFn](#type-definitions) |    ✅    |       -       | The function to throttle                                          |
| delay              |              number              |    ❌    |     300ms     | Minimum time interval between function executions in milliseconds |

### Type Definitions

::: details

```ts
export type ThrottledFn<T extends (...args: any[]) => any> = (...args: Parameters<T>) => void
```

:::

## Return Value(s)

This hook returns the throttled version of provided callback.

| Return Value  | Type                               | Description                                                                                |
| ------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| `throttledFn` | `(...args: Parameters<T>) => void` | Throttled version of the original function that limits execution to the specified interval |

## Common Use Cases

-  **API Rate Limiting:** Limiting search API calls while typing
-  **Mouse Movement Tracking:** Tracking mouse coordinate and update on screen
-  **Real-time data updates:** Managing WebSocket or polling frequency

## Usage Examples

### API Rate Limiting

```tsx {9-25}
import { useState } from 'react'
import { useThrottledFn } from 'classic-react-hooks'

export default function ApiExample() {
   const [data, setData] = useState<any[]>([])
   const [requestCount, setRequestCount] = useState(0)
   const [isLoading, setIsLoading] = useState(false)

   const throttledFetch = useThrottledFn({
      callbackToThrottle: async () => {
         setIsLoading(true)
         setRequestCount((prev) => prev + 1)

         try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
            const result = await response.json()
            setData(result)
         } catch (error) {
            console.error('Fetch failed:', error)
         } finally {
            setIsLoading(false)
         }
      },
      delay: 2000, // Max 1 request per 2 seconds
   })

   return (
      <div className='p-4'>
         <button
            onClick={throttledFetch}
            disabled={isLoading}
            className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed'
         >
            {isLoading ? 'Loading...' : 'Fetch Data (max 1/2sec)'}
         </button>
         <p className='mt-2 text-sm'>API calls made: {requestCount}</p>
         <div className='mt-4 space-y-2'>
            {data.map((item) => (
               <div key={item.id} className='my-1 p-2 border border-gray-300 rounded'>
                  <strong className='font-semibold'>{item.title}</strong>
               </div>
            ))}
         </div>
         <p className='mt-4'>
            <small className='text-gray-600'>Click rapidly - API calls are throttled to 1 per 2 seconds</small>
         </p>
      </div>
   )
}
```

### Mouse Movement Tracking

::: details Example

```tsx {8-17}
import { useState, useEffect } from 'react'
import { useThrottledFn } from 'classic-react-hooks'

export default function MouseTracker() {
   const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
   const [updateCount, setUpdateCount] = useState(0)

   const throttledMouseMove = useThrottledFn({
      callbackToThrottle: (event: MouseEvent) => {
         setMousePos({
            x: event.clientX,
            y: event.clientY,
         })
         setUpdateCount((prev) => prev + 1)
      },
      delay: 50, // 20 updates per second max
   })

   useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
         throttledMouseMove(event)
      }

      document.addEventListener('mousemove', handleMouseMove)
      return () => document.removeEventListener('mousemove', handleMouseMove)
   }, [throttledMouseMove])

   return (
      <div className='h-72 border-2 border-dashed border-gray-300 p-5'>
         <h3 className='text-lg font-semibold mb-2'>Mouse Position Tracker</h3>
         <p className='mb-1'>
            Position: ({mousePos.x}, {mousePos.y})
         </p>
         <p className='mb-1'>Updates: {updateCount}</p>
         <p>
            <small className='text-gray-600'>Move your mouse around this area</small>
         </p>
      </div>
   )
}
```

:::
