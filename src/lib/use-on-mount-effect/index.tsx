import type { EffectCallback } from 'react'
import React, { useEffect } from 'react'

/**
 * @description
 * A hooks that fires the given callback only once after the mount.
 * 
 * It doesn't take any dependencies.
 * 
 * 
 * @see Docs https://github.com/Ashish-simpleCoder/classic-react-hooks#use-on-mount-effect
 *
 * @example
   import { useOnMountEffect } from 'classic-react-hooks'
   
   export default function YourComponent() {
      useOnMountEffect(() => {
         console.log("initial mount")
      })

      return (
         <div></div>
      )
   }
*/
export default function useOnMountEffect(cb: EffectCallback) {
   useEffect(cb, [])
}
