---
outline: deep
---

# use-debouced-fn

-  A hook which returns a debounced function.

### Parameters

| Parameter |   Type   | Required | Default Value | Description                                                 |
| --------- | :------: | :------: | :-----------: | ----------------------------------------------------------- |
| cb        | Function |    ✅    |       -       | A callback which is to be debounced.                        |
| delay     |  number  |    ❌    |      300      | A delay in milliseconds after that the callback gets fired. |

### Returns

-  It returns a function which is debouced version of passed callback.

### Usage

```ts
import { useState } from 'react'
import { useDebouncedFn } from 'classic-react-hooks'

export default function YourComponent() {
   const [debouncedInput, setDebouncedInput] = useState('')
   const updateInput = useDebouncedFn((e) => {
      setDebouncedInput(e.target.value)
   }, 300)

   return (
      <div>
         <input onChange={updateInput} placeholder='type something...' />
         <p>
            value - <span>{debouncedInput}</span>
         </p>
      </div>
   )
}
```
