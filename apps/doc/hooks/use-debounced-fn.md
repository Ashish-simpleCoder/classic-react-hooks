---
outline: deep
---

# use-debouced-fn

A React hook that returns a debounced version of any function, delaying its execution until after a specified delay has passed since the last time it was invoked.

Perfect for optimizing performance in scenarios like search inputs, API calls, or resize handlers.

## Features

-  **Debouncing Functionality:** Delaying function execution until after a specified period of inactivity. Calling the function again before the delay expires, the previous call is cancelled and the timer resets.
-  **Configurable Delay:** You can specify a custom delay period, with a sensible default of 300ms.
-  **Dynamic Props Updates:** The hook properly handles updates to both the callback function and delay value during re-renders without losing the debouncing behavior.
-  **Performance optimized:** Prevents excessive function calls
-  **Auto cleanup:** Automatically clears timers on component unmount and on delay prop change

## Parameters

| Parameter        |   Type   | Required | Default Value | Description                                           |
| ---------------- | :------: | :------: | :-----------: | ----------------------------------------------------- |
| callbackToBounce | Function |    ✅    |       -       | The function to be debounced                          |
| delay            |  number  |    ❌    |      300      | Delay in milliseconds before the function is executed |

## Returns

-  Returns a debounced version of the provided function that will only execute after the specified delay has passed since the last invocation.

## Usage Examples

### Basic debouncing

```ts
import { useState, useEffect } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function SearchInput() {
   const [query, setQuery] = useState('')
   const [results, setResults] = useState([])

   const debouncedSearch = useDebouncedFn({
      callbackToBounce: async (searchTerm: string) => {
         if (searchTerm.trim()) {
            const response = await fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
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

   useEffect(() => {
      ;(async function () {
         const response = await fetch(`https://dummyjson.com/users`)
         const data = await response.json()
         setResults(data.results)
      })()
   }, [])

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

## Common Use Cases

-  Delay API calls until user stops typing
-  Validate fields after user pauses input
-  Prevent excessive API calls

## Alternative: Non-React Usage

For use outside of React components, use the standalone wrapper:

```ts
import { debouncedFnWrapper } from 'classic-react-hooks'

const { fn: debouncedLog, cleanup } = debouncedFnWrapper({
   callbackToBounce: (message: string) => console.log(message),
   delay: 1000,
})

// Use the debounced function
debouncedLog('Hello')
debouncedLog('World') // Only 'World' will be logged after 1 second

// Clean up when done
cleanup()
```
