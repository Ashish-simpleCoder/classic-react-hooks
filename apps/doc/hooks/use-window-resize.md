---
outline: deep
---

# use-window-resize

-  A hook which evaluates the passed callback on window resize event and returns the result of that callback.

### Parameters

| Parameter |            Type            | Required | Default Value | Description                                                         |
| --------- | :------------------------: | :------: | :-----------: | ------------------------------------------------------------------- |
| cb        | [Callback](#parametertype) |    ✅    |       -       | A callback which gets fired whenever the window resize event occurs |
| options   | [Options](#parametertype)  |    ❌    |   undefined   | Options to pass as feature flag                                     |

#### ParameterType

```ts
type Callback = () => T
type Options = { shouldInjectEvent?: boolean; defaultValue?: T }
```

### Returns

-  It returns the value, which is the result of the passed callback.

### Usage

```ts
import { useWindowResize } from 'classic-react-hooks'

export default function YourComponent() {
   const result = useWindowResize(() => {
      if (window.innerWidth < 500) {
         return 'md'
      }
      if (window.innerWidth > 500 && window.innerWidth < 800) {
         return 'lg'
      }
      return 'xl'
   })

   return (
      <>
         {result == 'md' && <h1>md</h1>}
         {result == 'lg' && <h1>lg</h1>}
         {result == 'xl' && <h1>xl</h1>}
      </>
   )
}
```
