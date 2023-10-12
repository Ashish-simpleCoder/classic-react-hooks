import type { Dispatch } from 'react'
import { useCallback, useEffect, useState } from 'react'

export default function useLocalStorage<State>(key: string, defaultValue?: State) {
   const [state, setState] = useState<State>(() => {
      try {
         const item = localStorage.getItem(key)
         const parsed_value = item == null ? '' : JSON.parse(item ?? '')
         return parsed_value
      } catch (err) {
         return undefined
      }
   })

   const updateState: Dispatch<React.SetStateAction<State>> = useCallback((value: State | ((state: State) => State)) => {
      let new_value = value
      if (typeof value == 'function') {
         setState((state) => {
            new_value = (value as (state: State) => State)(state)
            return new_value
         })
      }
      setState(new_value)
      localStorage.setItem(key, JSON.stringify(new_value))
   }, [])


   useEffect(() => {
      // only set default when not present in localStorage
      if (defaultValue && localStorage.getItem(key) == null) {
         updateState(defaultValue)
      }
   }, [])

   return [state, updateState] as const
}
