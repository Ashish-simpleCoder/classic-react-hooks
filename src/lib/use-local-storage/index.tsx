'use client'
import type { Dispatch, MutableRefObject } from 'react'
import React, { useRef, useState } from 'react'

/**
 * @description
 * A hook for managing the states with `local-storage`.
 *
 * It working is just like the `useState`.
 *
 * It automatically updates the state in `local-storage`.
 *
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-local-storage.html
 */
export default function useLocalStorage<State>(key: string, defaultValue?: State) {
   const [state, setState] = useState<State>(() => {
      try {
         const item = localStorage.getItem(key)
         if (defaultValue && item == null) {
            return defaultValue
         }
         const parsed_value = item == null ? '' : JSON.parse(item ?? '')
         return parsed_value
      } catch (err) {
         if (defaultValue) {
            return defaultValue
         }
         return undefined
      }
   })

   const updateState: MutableRefObject<Dispatch<React.SetStateAction<State>>> = useRef(
      (value: State | ((state: State) => State)) => {
         let new_value = value
         if (typeof value == 'function') {
            setState((state) => {
               new_value = (value as (state: State) => State)(state)
               localStorage.setItem(key, JSON.stringify(new_value))
               return new_value
            })
         } else {
            setState(new_value)
            localStorage.setItem(key, JSON.stringify(new_value))
         }
      }
   )

   return [state, updateState.current] as const
}
