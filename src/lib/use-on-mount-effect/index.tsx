'use client'
import type { EffectCallback } from 'react'
import React, { useEffect } from 'react'

/**
 * @description
 * A hooks that fires the given callback only once after the mount.
 *
 * It doesn't take any dependencies.
 *
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-on-mount-effect.html
 */
export default function useOnMountEffect(cb: EffectCallback) {
   useEffect(cb, [])
}
