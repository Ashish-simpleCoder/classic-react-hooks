import type { Dispatch } from 'react'
import React, { useCallback, useEffect, useState } from 'react'

/**
 * @description
 * A hook for managing the states with `local-storage`.
 * 
 * It working is just like the `useState`.
 * 
 * It automatically updates the state in `local-storage`.
 * 
 * 
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-local-storage
 *
 * @example
   import { useLocalStorage } from 'classic-react-hooks'
   
   export default function YourComponent() {
      const [user_details, setUserDetails] = useLocalStorage('user_details', { name: '' })

      return (
         <div>
            <input
               value={user_details.name}
               onChange={(e) =>
                  setUserDetails((user) => {
                     user.name = e.target.value
                     return { ...user }
                  })
               }
               className='py-1 px-3 rounded-md bg-white dark:bg-gray-900'
               placeholder='update name...'
            />
         </div>
      )
   }
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

   const updateState: Dispatch<React.SetStateAction<State>> = useCallback(
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
      },
      []
   )

   return [state, updateState] as const
}
