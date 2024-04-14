---
outline: deep
---

# use-counter

-  A simple hook for managing counter.

### Parameters

| Parameter |  Type  | Required | Default Value | Description                                                                 |
| --------- | :----: | :------: | :-----------: | --------------------------------------------------------------------------- |
| key       | string |    ❌    |      ""       | Based on the key, it generates `type-safe` object with `prefixed` proprety. |

### Returns

-  It returns an object.
-  `counter` : number
-  `incrementCounter` : () => void
-  `decrementCounter` : () => void

### Usage

```ts
import { useCounter } from 'classic-react-hooks'

export default function YourComponent() {
   const { counter, decrementCounter, incrementCounter } = useCounter()

   // If key is passed then properties within the object is prefixed with it.
   // const { userCounter, incrementUserCounter, decrementUserCounter } = useCounter("user")

   return (
      <div>
         <div>
            <button onClick={decrementCounter}>decrement</button>
            <p>{counter}</p>
            <button onClick={incrementCounter}>increment</button>
         </div>
      </div>
   )
}
```
