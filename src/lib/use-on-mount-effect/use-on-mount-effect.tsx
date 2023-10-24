import type { EffectCallback } from 'react'
import { useEffect } from 'react'

export default function useOnMountEffect(cb: EffectCallback) {
   useEffect(cb, [])
}
