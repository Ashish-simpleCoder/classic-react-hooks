---
outline: deep
---

# use-interval-effect

A React hook that executes a callback function at regular intervals, similar to `setInterval` but with additional control methods for clearing and restarting the timer.

### Features

-  **Scheduled execution:** Executes a callback with a fixed time delay between each call
-  **Flexible:** Provides methods to clear or restart the timer
-  **Automatic Cleanup:** Automatically cleans up timer on component unmount
-  **Syncronization:** Syncs with the latest callback and timeout values

### Parameters

| Parameter |   Type   | Required | Default Value | Description                                      |
| --------- | :------: | :------: | :-----------: | ------------------------------------------------ |
| handler   | Function |    ✅    |       -       | Callback function executed at each interval      |
| interval  |  number  |    ❌    |      100      | Time in milliseconds between callback executions |

### Returns

-  Returns an object with control methods:

   -  `clearTimer` : `() => void` Cancels the current interval, preventing the handler from executing
   -  `restartTimer` : `() => void` Clears the current timer and starts a new one. Optionally accepts a new interval value

### Usage

#### Basic example

```ts
import { useState } from 'react'
import { useIntervalEffect } from 'classic-react-hooks'

export default function Counter() {
   const [count, setCount] = useState(0)

   const { clearTimer, restartTimer } = useIntervalEffect({
      handler: () => setCount((prev) => prev + 1),
      interval: 1000, // 1 second
   })

   return (
      <div>
         <h2>Count: {count}</h2>
         <button onClick={clearTimer}>Pause</button>
         <button onClick={() => restartTimer()}>Resume</button>
         <button onClick={() => restartTimer(500)}>Speed Up (500ms)</button>
         <button onClick={() => restartTimer(2000)}>Slow Down (2s)</button>
      </div>
   )
}
```

### Common Use Cases

-  Countdown timers
-  Real-time updates (clocks, progress bars)
-  Polling APIs at regular intervals
