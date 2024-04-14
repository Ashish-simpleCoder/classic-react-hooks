---
outline: deep
---

# use-synced-ref

-  A replacement for `useRef` hook, which automatically syncs-up with the given state.
-  No need to manually update the ref.

### Parameters

| Parameter | Type | Required | Default Value | Description                 |
| --------- | :--: | :------: | :-----------: | --------------------------- |
| value     | any  |    ✅    |       -       | Value to be tracked in ref. |

### Returns

-  It returns the ref of given state.

### Usage

```ts
import { useState } from 'react'
import { useSyncedRef } from 'classic-react-hooks'

export default function YourComponent() {
   const [counter, setCounter] = useState(0)

   const counterRef = useSyncedRef(counter)

   return (
      <div>
         <button onClick={() => setCounter((c) => c + 1)}>increment</button>
      </div>
   )
}
```
