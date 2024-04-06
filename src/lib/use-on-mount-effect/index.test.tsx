import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useOnMountEffect from '.'

describe('use-on-mount-effect', () => {
   it('should run callback after the mount', () => {
      const fn = vi.fn()
      renderHook(() => useOnMountEffect(fn))
      expect(fn).toHaveBeenCalledTimes(1)
   })
})
