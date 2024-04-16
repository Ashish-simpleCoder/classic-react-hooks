---
outline: deep
---

# use-is-online

-  A simple hook for getting the network connection state.

### Returns

-  `connectionState` : boolean

### Usage

```ts
import { useIsOnline } from 'classic-react-hooks'

export default function YourComponent() {
   const isOnline = useIsOnline()

   return <div>{isOnline ? 'online' : 'offline'}</div>
}
```
