import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useSyncedEffect from '.'

describe('use-on-mount-effect', () => {
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

      const { rerender } = renderHook((props: Array<any>) => useSyncedEffect(fn, props ?? [skill]))
      expect(fn).toHaveBeenCalledTimes(0)

      skill = 'react'
      rerender([skill])
      expect(fn).toHaveBeenCalledTimes(1)

      skill = 'typescript'
      rerender([skill])
      expect(fn).toHaveBeenCalledTimes(2)
   })

   it('should run cleanup on un-mount', () => {
      const cleanupFn = vi.fn()
      const fn = vi.fn(() => cleanupFn)
      let skill = 'js'

      const { rerender, unmount } = renderHook((props: Array<any>) => useSyncedEffect(fn, props ?? [skill]))

      skill = 'react'
      rerender([skill])
      expect(fn).toHaveBeenCalledTimes(1)

      unmount()
      expect(cleanupFn).toHaveBeenCalledTimes(1)
   })
})
