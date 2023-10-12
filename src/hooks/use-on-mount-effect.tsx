import { useEffect } from 'react'

export default function useOnMountEffect(cb: () => void) {
   useEffect(cb, [])
}
