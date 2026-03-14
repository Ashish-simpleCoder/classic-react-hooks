---
outline: deep
---

# use-timeout-effect

_`use-timeout-effect`_ is a small utility React hook that provides a declarative wrapper around `setTimeout` with built-in lifecycle safety.

It schedules a callback to run after a specified delay while automatically cleaning up the timer when the component unmounts. The hook exposes simple control methods to clear or restart the timeout without reimplementing timer logic. This ensures predictable behavior across renders and avoids common pitfalls like orphaned timers.

::: tip
It is well suited for delayed UI updates, notifications, and one-off side effects.
:::

## Features

-  **Scheduled execution:** Executes a callback after a specified delay
-  **Flexible control:** Provides methods to clear or restart the timer
-  **Auto cleanup:** Automatically clears up timer on component unmount

## Parameters

| Parameter |   Type   | Required | Default Value | Description                                            |
| --------- | :------: | :------: | :-----------: | ------------------------------------------------------ |
| handler   | Function |    ✅    |       -       | The callback function to execute after the timeout     |
| timeout   |  number  |    ❌    |      100      | The delay in milliseconds before executing the handler |

## Return value(s)

This hooks returns an object having several utility functions for controlling the timeout-effect:

| Property     | Type                            | Description                                                                                                                                                                                    |
| ------------ | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clearTimer   | () => void                      | Clears the current timeout timer, preventing the handler from executing if it hasn't already run. Similar to calling `clearTimeout()` on a standard timeout.                                   |
| restartTimer | (new_interval?: number) => void | Clears the current timer and starts a new one. Optionally accepts a `new_interval` parameter to use a different timeout duration. If no interval is provided, uses the original timeout value. |

## Usage Examples

### Basic use

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
