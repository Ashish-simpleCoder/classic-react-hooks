---
outline: deep
---

# use-synced-effect

-  A hooks that fires the given callback for given dependencies when they get change.
-  It works exacatly like `useEffect`. But callback doesn't get fired on initial mount.

### Parameters

| Parameter |   Type   | Required | Default Value | Description                                     |
| --------- | :------: | :------: | :-----------: | ----------------------------------------------- |
| cb        | Function |    ✅    |       -       | Function to fire when dependencies get changed. |
| deps      |  Array   |    ❌    |      []       | Dependencies.                                   |

### Usage

```ts
import { useState } from 'react'
import { useSyncedEffect } from 'classic-react-hooks'

export default function YourComponent() {
   const [counter, setCounter] = useState(0)

   useSyncedEffect(() => {
      console.log('counter changed to ', counter)
   }, [counter])

   return (
      <div>
         <button onClick={() => setCounter((c) => c + 1)}>increment</button>
      </div>
   )
}
```
