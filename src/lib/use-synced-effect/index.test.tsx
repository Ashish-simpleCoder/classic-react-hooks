import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useSyncedEffect from '.'

describe('use-on-mount-effect', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })

   it('should not run callback on initial the mount', () => {
      const fn = vi.fn()
      renderHook(() => useSyncedEffect(fn, []))
      expect(fn).toHaveBeenCalledTimes(0)
   })
   it('should work without dependency passed', () => {
      const fn = vi.fn()
      renderHook(() => useSyncedEffect(fn))
      expect(fn).toHaveBeenCalledTimes(0)
   })

   it('should run callback on when dependency is changed', () => {
      const fn = vi.fn()
      let skill = 'js'

      const { rerender } = renderHook(() => useSyncedEffect(fn, [skill]))
      expect(fn).toHaveBeenCalledTimes(0)

      vi.runAllTimers()

      skill = 'react'
      rerender()
      expect(fn).toHaveBeenCalledTimes(1)

      skill = 'typescript'
      rerender()
      expect(fn).toHaveBeenCalledTimes(2)
   })

   it('should run cleanup on un-mount', () => {
      const cleanupFn = vi.fn()
      const fn = vi.fn(() => cleanupFn)
      let skill = 'js'

      const { rerender, unmount } = renderHook(() => useSyncedEffect(fn, [skill]))
      vi.runAllTimers()

      skill = 'react'
      rerender()
      expect(fn).toHaveBeenCalledTimes(1)

      unmount()
      expect(cleanupFn).toHaveBeenCalledTimes(1)
   })
})
