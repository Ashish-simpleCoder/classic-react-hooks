import { useRef } from 'react'

export default function useSyncedRef<T>(data: T) {
   const dataRef = useRef(data)
   dataRef.current = data
   return dataRef
}
