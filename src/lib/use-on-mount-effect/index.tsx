import type { EffectCallback } from 'react'
import React, { useEffect } from 'react'

/**
 * @description
 * A React hook that executes a callback function only once after the component mounts. This is a simplified wrapper around useEffect with an empty dependency array.
 *
 * @example
   import { useOnMountEffect } from 'classic-react-hooks'
   export default function YourComponent() {
      useOnMountEffect(() => {
         console.log('initial mount')
      })

      return <div></div>
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-on-mount-effect.html
 */
export default function useOnMountEffect(cb: EffectCallback) {
   useEffect(cb, [])
}
