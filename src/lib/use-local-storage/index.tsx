'use client'
import type { Dispatch, MutableRefObject } from 'react'
import React, { useRef, useState } from 'react'

/**
 * @description
 * A React hook that synchronizes state with localStorage, providing `persistent` state management across browser `sessions`.
 *
 * @example
   import { useLocalStorage } from 'classic-react-hooks'

   function UserPreferences() {
      const [theme, setTheme] = useLocalStorage({ key: 'theme', defaultValue: 'light' })
      const [language, setLanguage] = useLocalStorage({ key: 'language', defaultValue: 'en' })

      return (
         <div>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
               <option value='light'>Light</option>
               <option value='dark'>Dark</option>
            </select>

            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
               <option value='en'>English</option>
               <option value='es'>Spanish</option>
               <option value='fr'>French</option>
            </select>
         </div>
      )
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-local-storage.html
 */
export default function useLocalStorage<State>({ key, defaultValue }: { key: string; defaultValue?: State }) {
   const [state, setState] = useState<State>(() => {
      try {
         const item = localStorage.getItem(key)
         if (defaultValue && item == null) {
            return defaultValue
         }
         const parsed_value = item == null ? '' : JSON.parse(item)
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
