---
outline: deep
---

# use-debouced-fn

-  A hook which returns a debounced function.

### Parameters

| Parameter |   Type   | Required | Default Value | Description                                 |
| --------- | :------: | :------: | :-----------: | ------------------------------------------- |
| cb        | Function |    ✅    |       -       | A callback which is to be debounced.        |
| delay     |  number  |    ❌    |     true      | A delay after that the callback gets fired. |

### Returns

-  It returns a function which debouced version of passed cb.

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
