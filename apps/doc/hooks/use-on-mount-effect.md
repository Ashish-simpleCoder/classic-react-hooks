---
outline: deep
---

# use-on-mount-effect

A React hook that executes a callback function only once after the component mounts. This is a simplified wrapper around useEffect with an empty dependency array.

This hook is perfect for initialization logic that should run exactly once when a component first renders.

## Parameters

| Parameter |         Type         | Required | Default Value | Description                                                                   |
| --------- | :------------------: | :------: | :-----------: | ----------------------------------------------------------------------------- |
| cb        | React.EffectCallback |    ✅    |       -       | Callback function to execute once after mount. Can return a cleanup function. |

## Usage Examples

### Basic Usage - Initialization Logic

```ts
import { useOnMountEffect } from 'classic-react-hooks'

export default function YourComponent() {
   useOnMountEffect(() => {
      console.log('initial mount')
   })

   return <div></div>
}
```

## Comparison with useEffect

| Scenario            | useEffect(cb, [])    | useOnMountEffect(cb)      |
| ------------------- | -------------------- | ------------------------- |
| Intent clarity      | ❌ Less obvious      | ✅ Crystal clear          |
| Code brevity        | ❌ More verbose      | ✅ Cleaner                |
| Dependency mistakes | ⚠️ Easy to forget [] | ✅ No dependencies needed |
| TypeScript support  | ✅ Yes               | ✅ Yes                    |
| Cleanup support     | ✅ Yes               | ✅ Yes                    |

## Common Use Cases

-  Setting up initial state or configuration
-  Any one-time setup that shouldn't repeat after component mount
