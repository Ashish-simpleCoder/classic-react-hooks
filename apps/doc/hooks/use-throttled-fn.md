---
outline: deep
---

# use-throttled-fn

-  A hook which returns a throttled function.

### Parameters

| Parameter |   Type   | Required | Default Value | Description                                                 |
| --------- | :------: | :------: | :-----------: | ----------------------------------------------------------- |
| cb        | Function |    ✅    |       -       | A callback which is to be throttled.                        |
| delay     |  number  |    ❌    |      300      | A delay in milliseconds after that the callback gets fired. |

### Returns

-  It returns a function which is throttled version of passed callback.

### Usage

```ts
import { useState } from 'react'
import { useThrottledFn } from 'classic-react-hooks'

export default function YourComponent() {
   const [throttledInput, setThrottledInput] = useState('')
   const updateInput = useThrottledFn((e) => {
      setThrottledInput(e.target.value)
   }, 300)

   return (
      <div>
         <input onChange={updateInput} placeholder='type something...' />
         <p>
            value - <span>{throttledInput}</span>
         </p>
      </div>
   )
}
```
