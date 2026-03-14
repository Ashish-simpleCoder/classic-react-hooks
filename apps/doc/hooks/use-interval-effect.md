---
outline: deep
---

# use-interval-effect

_`use-interval-effect`_ is a declarative React hook that provides a safe and flexible abstraction over `setInterval`.

It repeatedly executes a callback at a specified interval while automatically handling setup and cleanup during the component lifecycle. The hook exposes simple control methods to pause or restart the interval, optionally with a new duration, without reimplementing timer logic. Its stable, cleanup-aware design prevents orphaned intervals and unexpected side effects.

::: tip
This hook is ideal for counters, polling, animations, and periodic background tasks.
:::

## Features

-  **Recurring execution:** Executes a callback at regular intervals
-  **Flexible control:** Provides methods to clear or restart the timer with different intervals
-  **Auto cleanup:** Automatically clears up interval on component unmount

## Parameters

| Parameter |   Type   | Required | Default Value | Description                                                     |
| --------- | :------: | :------: | :-----------: | --------------------------------------------------------------- |
| handler   | Function |    ✅    |       -       | The callback function to execute at each interval               |
| interval  |  number  |    ❌    |      100      | The delay in milliseconds between each execution of the handler |

## Return value(s)

This hooks returns an object having several utility functions for controlling the interval-effect:

| Property     | Type                            | Description                                                                                                                                                                                      |
| ------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| clearTimer   | () => void                      | Clears the current interval timer, stopping the recurring execution of the handler. Similar to calling `clearInterval()` on a standard interval.                                                 |
| restartTimer | (new_interval?: number) => void | Clears the current timer and starts a new one. Optionally accepts a `new_interval` parameter to use a different interval duration. If no interval is provided, uses the original interval value. |

## Usage Examples

### Basic example

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
