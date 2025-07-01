---
outline: deep
---

# use-throttled-fn

A React hook that returns a throttled version of a callback function.

Throttling ensures that the function is called at most once per specified time interval, regardless of how many times it's invoked.

This is particularly useful for performance optimization in scenarios like handling rapid user input, scroll events, or API calls.

### Features

-  **Throttling Functionality:** Limits function execution to at most once per specified time period
-  **Configurable Delay:** Accepts a custom delay period with a default of 300ms
-  **Dynamic Props Updates:** The hook properly handles updates to both the callback function and delay value during re-renders without losing the debouncing behavior
-  **Performance optimized:** Prevents excessive function calls

### Parameters

| Parameter          |   Type   | Required | Default Value | Description                                               |
| ------------------ | :------: | :------: | :-----------: | --------------------------------------------------------- |
| callbackToThrottle | Function |    ✅    |       -       | The callback function that should be throttled            |
| delay              |  number  |    ❌    |      300      | Delay in milliseconds between allowed function executions |

### Returns

-  Returns a throttled version of the provided callback function that maintains the same signature and behavior, but with throttling applied.

### Usage Examples

#### Basic API throttling

```ts
import { useState } from 'react'
import { useThrottledFn } from 'classic-react-hooks'

export default function AutoSave() {
   const [content, setContent] = useState('')
   const [saving, setSaving] = useState(false)

   const saveContent = useThrottledFn({
      callbackToThrottle: async (text) => {
         setSaving(true)
         try {
            await saveToAPI(text)
            console.log('Content saved!')
         } catch (error) {
            console.error('Save failed:', error)
         } finally {
            setSaving(false)
         }
      },
      delay: 2000, // Auto-save every 2 seconds at most
   })

   const handleChange = (e) => {
      const newContent = e.target.value
      setContent(newContent)
      saveContent(newContent)
   }

   return (
      <div>
         <textarea value={content} onChange={handleChange} placeholder='Type your content...' />
         {saving && <p>Saving...</p>}
      </div>
   )
}
```

### Common Use Cases

-  Real-time form validation
-  Prevent excessive API calls
-  Throttle scroll event processing

### Alternative: Non-React Usage

For use outside of React components, use the standalone wrapper:

```ts
import { throttledFnWrapper } from 'classic-react-hooks'

const throttledLog = throttledFnWrapper({
   callbackToThrottle: (message: string) => console.log(message),
   delay: 1000,
})

// Use the throttled function
throttledLog('Hello') // will log "Hello" in console
throttledLog('World') // ignored till 1 second is not passed
throttledLog('1') // ignored till 1 second is not passed
throttledLog('2') // ignored till 1 second is not passed
throttledLog('3') // ignored till 1 second is not passed
// block for 1 second
await sleep(1000)
throttledLog('4') // will log "4" in console
```
