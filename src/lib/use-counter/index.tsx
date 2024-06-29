'use client'
import type { Prettify } from '../../types'
import React, { useCallback, useState } from 'react'
import { capitalizeFirstLetter } from '../../utils/capitalize-first-letter'

const COUNTER_TEXT = 'Counter'
const LOWERCASED_COUNTER_TEXT = COUNTER_TEXT.toLowerCase() as Lowercase<typeof COUNTER_TEXT>

/**
 * @description
 *  A simple hook for managing counter.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-counter.html
 *
 */
export default function useCounter<K extends string = ''>(key = '' as K) {
   const [counter, setCounter] = useState(0)

   const capitalizedKey = capitalizeFirstLetter(key)

   // typed-key evaluation
   type TypedCounterKey = `${typeof key}${K extends '' ? typeof LOWERCASED_COUNTER_TEXT : typeof COUNTER_TEXT}`
   type TypedIncrementKey = `increment${typeof capitalizedKey}${typeof COUNTER_TEXT}`
   type TypedDerementKey = `decrement${typeof capitalizedKey}${typeof COUNTER_TEXT}`

   // type-safe key generation
   const CounterName = `${key}${key == '' ? LOWERCASED_COUNTER_TEXT : COUNTER_TEXT}` as const
   const Increment = `increment${capitalizedKey}${COUNTER_TEXT}` as const
   const Decrement = `decrement${capitalizedKey}${COUNTER_TEXT}` as const

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
      {
         [KeyName in K as TypedCounterKey]: number
      } & {
         [Increment in TypedIncrementKey as TypedIncrementKey]: () => void
      } & {
         [Derement in TypedDerementKey as TypedDerementKey]: () => void
      }
   >
}
