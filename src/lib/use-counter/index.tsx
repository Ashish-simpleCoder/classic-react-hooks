'use client'
import type { Prettify } from '../../types'
import React, { useRef, useState } from 'react'
import { capitalizeFirstLetter } from '../../utils/capitalize-first-letter'

const COUNTER_TEXT = 'Counter'
const LOWERCASED_COUNTER_TEXT = COUNTER_TEXT.toLowerCase() as Lowercase<typeof COUNTER_TEXT>

/**
 * @description
 * A type-safe React hook for managing counter state with customizable step values and dynamic property naming.
 *
 * @example
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
 * 
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-counter.html
 *
 */
export default function useCounter<K extends string = ''>(
   key = '' as K,
   options?: { initialValue?: number; stepper?: number }
) {
   const [counter, setCounter] = useState(options?.initialValue ?? 0)
   let jumpBy = options?.stepper ?? 1

   const capitalizedKey = capitalizeFirstLetter(key)

   // typed-key evaluation
   type TypedCounterKey = `${typeof key}${K extends '' ? typeof LOWERCASED_COUNTER_TEXT : typeof COUNTER_TEXT}`
   type TypedIncrementKey = `increment${typeof capitalizedKey}${typeof COUNTER_TEXT}`
   type TypedDerementKey = `decrement${typeof capitalizedKey}${typeof COUNTER_TEXT}`

   // type-safe key generation
   const CounterName = `${key}${key == '' ? LOWERCASED_COUNTER_TEXT : COUNTER_TEXT}` as const
   const Increment = `increment${capitalizedKey}${COUNTER_TEXT}` as const
   const Decrement = `decrement${capitalizedKey}${COUNTER_TEXT}` as const

   const handlers = useRef({
      incrementHandler: () => {
         setCounter((c) => c + jumpBy)
      },
      decrementHandler: () => {
         setCounter((c) => c - jumpBy)
      },
   })

   return {
      [CounterName]: counter,
      [Increment]: handlers.current.incrementHandler,
      [Decrement]: handlers.current.decrementHandler,
   } as Prettify<
      {
         [KeyName in K as TypedCounterKey]: number
      } & {
         [Increment in TypedIncrementKey as TypedIncrementKey]: () => void
      } & {
         [Derement in TypedDerementKey as TypedDerementKey]: () => void
      }
   >
}
