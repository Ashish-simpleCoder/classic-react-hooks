---
outline: deep
---

# use-on-mount-effect

_`use-on-mount-effect`_ is a small, intention-revealing React hook that runs a side effect exactly once after a component mounts. It provides a clear, declarative alternative to `useEffect` with an empty dependency array, eliminating ambiguity and dependency mistakes.

The hook supports cleanup functions just like `useEffect`, making it safe for subscriptions and external integrations. By explicitly modeling mount-only behavior, it improves code readability and communicates intent more clearly. This makes it ideal for initialization logic and third-party setup code.

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
