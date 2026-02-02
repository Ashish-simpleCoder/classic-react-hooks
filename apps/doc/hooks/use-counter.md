---
outline: deep
---

# use-counter

A Hook for Fun

_`use-counter`_ is a playful yet type-safe React hook for managing counter state with minimal setup and maximum flexibility.

It supports configurable initial values and step sizes while generating strongly typed, ergonomically named properties. By optionally accepting a key, the hook dynamically prefixes returned state and handlers, improving readability and avoiding naming collisions.

Its simple API makes it ideal for demos, UI controls, scores, and quick stateful interactions. Despite its fun nature, it remains fully predictable and TypeScript-friendly.

## Features

-  Find out yourself buddy

## Parameters

| Parameter    | Type   | Required | Default Value | Description                                                               |
| ------------ | ------ | :------: | :-----------: | ------------------------------------------------------------------------- |
| key          | string |    ❌    |      ""       | Prefix for generated property names. Creates type-safe object properties. |
| props        | object |    ❌    |   undefined   | Configuration object containing `initialValue` and `stepper`.             |
| initialValue | number |    ❌    |       0       | Initial value for the counter.                                            |
| stepper      | number |    ❌    |       1       | Amount to increment/decrement by on each operation.                       |

## Return value(s)

Returns a type-safe object with dynamically named properties:

### Without key (default):

-  `counter:` number - Current counter value
-  `incrementCounter:` () => void - Function to increment counter
-  `decrementCounter:` () => void - Function to decrement counter

### With key (e.g., "user"):

-  `userCounter:` number - Current counter value
-  `incrementUserCounter:` () => void - Function to increment counter
-  `decrementUserCounter:` () => void - Function to decrement counter

## Usage Examples

### Basic Counter

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

### Named Counter with Custom Step

```ts
import { useCounter } from 'classic-react-hooks'

export default function UserScoreCounter() {
   const { userCounter, incrementUserCounter, decrementUserCounter } = useCounter('user', {
      initialValue: 10,
      stepper: 5,
   })

   return (
      <div>
         <h3>User Score: {userCounter}</h3>
         <button onClick={decrementUserCounter}>-5</button>
         <button onClick={incrementUserCounter}>+5</button>
      </div>
   )
}
```
