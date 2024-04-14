---
outline: deep
---

# use-timeout-effect

-  A hooks which fires the provided callback only once when the given delay is passed, just like the setTimeout.

### Parameters

| Parameter |   Type   | Required | Default Value | Description                                               |
| --------- | :------: | :------: | :-----------: | --------------------------------------------------------- |
| cb        | Function |    ✅    |       -       | Callback to fire after given amount of timeout is passed. |
| timeout   |  number  |    ❌    |      100      | Timeout value after which the callback is fired.          |

### Returns

-  It returns an object.
-  `clearTimer` : () => void
-  `restartTimer` : () => void

### Usage

```ts
import { useState } from 'react'
import { useTimeoutEffect } from 'classic-react-hooks'

export default function YourComponent() {
   const [show, setShow] = useState(false)

   useTimeoutEffect(() => {
      console.log('use-timeout-callback')
      setShow(true)
   }, 2000)

   return <div>{show && <div>show</div>}</div>
}
```
