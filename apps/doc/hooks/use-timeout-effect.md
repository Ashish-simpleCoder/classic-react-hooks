---
outline: deep
---

# use-timeout-effect

A React hook that fires a provided callback after a specified timeout, similar to `setTimeout`, but with additional control methods for clearing and restarting the timer.

### Features

-  **Scheduled execution:** Executes a callback after a specified delay
-  **Flexible:** Provides methods to clear or restart the timer
-  **Automatic Cleanup:** Automatically cleans up timer on component unmount
-  **Syncronization:** Syncs with the latest callback and timeout values

### Parameters

| Parameter |   Type   | Required | Default Value | Description                                            |
| --------- | :------: | :------: | :-----------: | ------------------------------------------------------ |
| handler   | Function |    ✅    |       -       | The callback function to execute after the timeout     |
| timeout   |  number  |    ❌    |      100      | The delay in milliseconds before executing the handler |

### Returns

-  Returns an object with control methods:

   -  `clearTimer` : `() => void` Cancels the current timeout, preventing the handler from executing
   -  `restartTimer` : `() => void` Clears the current timer and starts a new one. Optionally accepts a new timeout value

### Usage Examples

#### Basic use

```ts
import { useState } from 'react'
import useTimeoutEffect from './useTimeoutEffect'

export default function BasicExample() {
   const [message, setMessage] = useState('')

   useTimeoutEffect({
      handler: () => {
         setMessage('Timer executed!')
      },
      timeout: 2000,
   })

   return <div>{message}</div>
}
```

### Important Notes

-  The hook uses `useSyncedRef` to ensure the latest callback and timeout values are always used.
-  The restartTimer method can accept an optional new timeout value, otherwise it uses the original timeout.
