import { useCallback, useRef, useSyncExternalStore } from 'react'

export default function useLocal<State>({ key, initialValue }: { key: string, initialValue?: State | (() => State) }) {
    // Cache the last parse value to avoid unnecessary re-renders
    const lastValueRef = useRef<State | null>(null)
    const lastStringRef = useRef<string | null>(null)
    const lastKeyRef = useRef<string>(key)

    const getStoredState = useCallback(() => {
        try {
            // Key has changed, reset cached values
            if (lastKeyRef.current !== key) {
                localStorage.removeItem(lastKeyRef.current)
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
        if (typeof initialValue == "function") {
            returnVal = (initialValue as () => State)()
        } else {
            returnVal = initialValue as State
        }

        // Cache the initial value
        lastValueRef.current = returnVal
        return returnVal
    }, [key, initialValue])

    // Server-side snapshot - return initial value to avoid hydration mismatch
    const getServerSnapshot = useCallback(() => {
        if (typeof initialValue == 'function') {
            return (initialValue as () => State)()
        }
        return initialValue as State
    }, [initialValue])

    const storedState = useSyncExternalStore(
        useCallback((callback) => {
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
        }, []),
        getStoredState,
        getServerSnapshot
    )

    const updateState = useCallback(() => {
        (value: State | (() => State)) => {
            try {
                let newValue: State

                if (typeof value === 'function') {
                    newValue = (value as (state: State) => State)(storedState)
                } else {
                    newValue = value
                }

                const serializedValue = JSON.stringify(newValue)
                localStorage.setItem(key, serializedValue)

                // Update cache
                lastStringRef.current = serializedValue
                lastValueRef.current = newValue

                // Notify subscriber
                window.dispatchEvent(new Event(key))
            } catch (err) {
                console.log(err)
            }
        }
    }, [key, storedState])

    return [storedState, updateState] as const
}