import { useCallback, useState } from 'react'
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

const COUNTER_TEXT = 'Counter'
const SMALL_COUNTER_TEXT = COUNTER_TEXT.toLowerCase() as Lowercase<typeof COUNTER_TEXT>

export default function useCounter<K extends string = ''>(key = '' as K) {
   const [counter, setCounter] = useState(0)

   const capitalizedKey = capitalizeFirstLetter(key)

   // typed-key evaluation
   type TypedCounterKey = `${typeof key}${K extends '' ? typeof SMALL_COUNTER_TEXT : typeof COUNTER_TEXT}`
   type TypedIncrementKey = `increment${typeof capitalizedKey}${typeof COUNTER_TEXT}`
   type TypedDerementKey = `decrement${typeof capitalizedKey}${typeof COUNTER_TEXT}`

   // type-safe key generation
   const CounterName = `${key}${key == '' ? SMALL_COUNTER_TEXT : COUNTER_TEXT}` as const
   const Increment = `increment${capitalizedKey}${COUNTER_TEXT}`
   const Decrement = `decrement${capitalizedKey}${COUNTER_TEXT}`

   const incrementHandler = useCallback(() => {
      setCounter((c) => c + 1)
   }, [])
   const decrementHandler = useCallback(() => {
      setCounter((c) => c - 1)
   }, [])

   return {
      [CounterName]: counter,
      [Increment]: incrementHandler,
      [Decrement]: decrementHandler,
   } as Prettify<
      { [KeyName in K as TypedCounterKey]: number } & {
         [Increment in TypedIncrementKey as TypedIncrementKey]: () => void
      } & {
         [Derement in TypedDerementKey as TypedDerementKey]: () => void
      }
   >
}

// import { useCallback, useState } from 'react'
// import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter'

// const COUNTER_TEXT = 'Counter'
// const SMALL_COUNTER_TEXT = 'counter'

// export default function useCounter<K extends string = ''>(key = '' as K) {
//    const capitalizedKey = capitalizeFirstLetter(key)

//    type TypedCounterKey = `${typeof key}${typeof SMALL_COUNTER_TEXT}`
//    type TypedIncrementKey = `increment${typeof capitalizedKey}${typeof COUNTER_TEXT}`
//    type TypedDerementKey = `decrement${typeof capitalizedKey}${typeof COUNTER_TEXT}`

//    const CounterName = `${key}${COUNTER_TEXT.toLocaleLowerCase()}` as const
//    const Increment = `increment${capitalizedKey}${COUNTER_TEXT}`
//    const Decrement = `decrement${capitalizedKey}${COUNTER_TEXT}`

//    const [counter, setCounter] = useState(0)

//    const incrementHandler = useCallback(() => {
//       setCounter((c) => c + 1)
//    }, [])
//    const decrementHandler = useCallback(() => {
//       setCounter((c) => c - 1)
//    }, [])

//    return {
//       [CounterName]: counter,
//       [Increment]: incrementHandler,
//       [Decrement]: decrementHandler,
//    } as Prettify<
//       { [KeyName in K as TypedCounterKey]: number } & {
//          [Increment in TypedIncrementKey as TypedIncrementKey]: () => void
//       } & {
//          [Derement in TypedDerementKey as TypedDerementKey]: () => void
//       }
//    >
// }
