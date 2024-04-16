---
outline: deep
---

# use-interval-effect

-  A hooks which fires the provided callback every time when the given delay is passed, just like the setInterval.

### Parameters

| Parameter |   Type   | Required | Default Value | Description                                                          |
| --------- | :------: | :------: | :-----------: | -------------------------------------------------------------------- |
| cb        | Function |    ✅    |       -       | Callback gets fired after every given amount of interval is passed . |
| interval  |  number  |    ❌    |      100      | Interval value after which the callback is fired.                    |

### Returns

-  It returns an object.
-  `clearTimer` : () => void
-  `restartTimer` : () => void

### Usage

```ts
import { useState } from 'react'
import { useIntervalEffect } from 'classic-react-hooks'

export default function YourComponent() {
   const [counter, setCounter] = useState(0)
   const { clearTimer, restartTimer } = useIntervalEffect(() => {
      setCounter((c) => c + 1)
   }, 1000)

   return (
      <div>
         <p>{counter}</p>
         <button onClick={clearTimer}>Pause timer</button>
         <button onClick={restartTimer}>Restart timer</button>
      </div>
   )
}
```
