---
outline: deep
---

# use-on-mount-effect

-  A hooks that fires the given callback only once after the mount.
-  It doesn't take any dependencies.

### Parameters

| Parameter |   Type   | Required | Default Value | Description                           |
| --------- | :------: | :------: | :-----------: | ------------------------------------- |
| cb        | Function |    ✅    |       -       | Function to fire after initial mount. |

### Usage

```ts
import { useOnMountEffect } from 'classic-react-hooks'

export default function YourComponent() {
   useOnMountEffect(() => {
      console.log('initial mount')
   })

   return <div></div>
}
```
