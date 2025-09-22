---
outline: deep
---

# use-on-mount-effect

A React hook that executes a callback function only once after the component mounts. This is a simplified wrapper around useEffect with an empty dependency array.

::: tip
This hook is perfect for initialization logic that should run exactly once when a component first renders.
:::

## Features

-  **One-time execution:** Runs callback only once after component mounts
-  **Mount-only focus:** Explicitly designed for mount-time operations
-  **Compatible API:** Wrapper around `useEffect` hook

## Parameters

| Parameter |         Type         | Required | Default Value | Description                                                                                             |
| --------- | :------------------: | :------: | :-----------: | ------------------------------------------------------------------------------------------------------- |
| cb        | React.EffectCallback |    ✅    |       -       | The callback function to execute once after component mounts. Can optionally return a cleanup function. |

## Common Use Cases

-  **Setup Initialization:** Running one-time setup code
-  **Third-party libraries:** Initializing external libraries or plugins

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
