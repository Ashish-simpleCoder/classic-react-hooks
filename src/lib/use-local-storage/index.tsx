import type { Dispatch, SetStateAction } from 'react'
import React, { useRef, useCallback, useSyncExternalStore } from 'react'

/**
 * @description
 * A React hook that provides a seamless way to persist and synchronize state with `localStorage`, offering a `useState`-like API with automatic cross-tab synchronization.
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
export default function useLocalStorage<State>({
   key,
   initialValue,
}: {
   key: string
   initialValue?: State | (() => State)
}) {
   // Cache the last parse value to avoid unnecessary re-renders
   const lastValueRef = useRef<State | null>(null)
   const lastStringRef = useRef<string | null>(null)
   const lastKeyRef = useRef<string>(key)

   const getStoredState = useCallback(() => {
      try {
         // Key has changed, reset cached values
         if (lastKeyRef.current !== key) {
            localStorage.removeItem(lastKeyRef.current)
            localStorage.setItem(key, JSON.stringify(lastValueRef.current))
            lastKeyRef.current = key
            lastValueRef.current = null
            lastStringRef.current = null
         }

         const item = localStorage.getItem(key)

         if (item != null) {
            // Only parse if the string value has changed
            if (lastStringRef.current !== item) {
               lastStringRef.current = item
               lastValueRef.current = JSON.parse(item)
            }
            return lastValueRef.current!
         }
      } catch (err) {
         console.log(err)
      }

      // Return initial value
      let returnVal: State
      if (lastValueRef.current) {
         returnVal = lastValueRef.current
      } else if (typeof initialValue == 'function') {
         returnVal = (initialValue as () => State)()
      } else {
         returnVal = initialValue as State
      }

      // Cache the initial value
      lastValueRef.current = returnVal

      return lastValueRef.current!
   }, [key])

   // Server-side snapshot - return initial value to avoid hydration mismatch
   const getServerSnapshot = useCallback(() => {
      if (lastValueRef.current) {
         return lastValueRef.current
      }
      if (typeof initialValue == 'function') {
         lastValueRef.current = (initialValue as () => State)()
      } else {
         lastValueRef.current = initialValue as State
      }
      return lastValueRef.current!
   }, [])

   const storedState = useSyncExternalStore(
      useCallback(
         (callback) => {
            const handleStorageChange = (event: Event) => {
               callback()
            }

            // Listen for our custom events
            window.addEventListener(key, handleStorageChange)

            // Also listen for storage event from other tabs
            const handleStorageEvent = (event: StorageEvent) => {
               if (event.key === key) {
                  callback()
               }
            }

            window.addEventListener('storage', handleStorageEvent)

            return () => {
               window.removeEventListener(key, handleStorageChange)
               window.removeEventListener('storage', handleStorageEvent)
            }
         },
         [key]
      ),
      getStoredState,
      getServerSnapshot
   )

   const updateState: Dispatch<SetStateAction<State>> = useCallback(
      (state: State | ((prevState: State) => State)) => {
         try {
            let newValue: State

            if (typeof state === 'function') {
               newValue = (state as (state: State) => State)(storedState)
            } else {
               newValue = state
            }

            const serializedValue = JSON.stringify(newValue === undefined ? null : newValue)
            localStorage.setItem(key, serializedValue)

            // Update cache
            lastStringRef.current = serializedValue
            lastValueRef.current = newValue

            // Notify subscriber
            window.dispatchEvent(new Event(key))
         } catch (err) {
            console.log(err)
         }
      },
      [key, storedState]
   )

   return [storedState, updateState] as const
}
