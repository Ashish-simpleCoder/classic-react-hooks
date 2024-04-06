import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useTimoeoutEffect from '.'

describe('use-timeout-effect', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })
   afterEach(() => {
      vi.useRealTimers()
   })
   afterEach(() => {
      vi.clearAllTimers()
   })

   it('should fire callback with default timeout of 0ms after the mount', () => {
      const fn = vi.fn()
      renderHook(() => useTimoeoutEffect(fn))

      expect(fn).toHaveBeenCalledTimes(0)
      vi.advanceTimersByTime(0)
      expect(fn).toHaveBeenCalledTimes(1)
   })

   it('should fire callback after the given timeout', () => {
      const fn = vi.fn()
      renderHook(() => useTimoeoutEffect(fn, 500))

      expect(fn).toHaveBeenCalledTimes(0)
      vi.advanceTimersByTime(0)
      expect(fn).toHaveBeenCalledTimes(0)

      vi.advanceTimersByTime(400)
      expect(fn).toHaveBeenCalledTimes(0)

      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(1)
   })

   it('should clear the timeout with clearTimer', () => {
      const fn = vi.fn()
      const { result } = renderHook(() => useTimoeoutEffect(fn, 500))

      result.current.clearTimer()
      vi.advanceTimersByTime(500)
      expect(fn).not.toHaveBeenCalled()
   })

   it('should set the timeout with restartTimer', () => {
      const fn = vi.fn()
      const { result } = renderHook(() => useTimoeoutEffect(fn, 500))

      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalled()
      expect(fn).toHaveBeenCalledTimes(1)

      // restart
      result.current.restartTimer()
      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(2)

      // restart and clear and restart
      result.current.restartTimer()
      result.current.clearTimer()
      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(2)

      result.current.restartTimer()
      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(3)
   })

   it('should clear interval on unmount', () => {
      const fn = vi.fn()
      const { unmount } = renderHook(() => useTimoeoutEffect(fn, 500))

      // cleanup the timer
      vi.advanceTimersByTime(400)
      unmount()
      expect(fn).toHaveBeenCalledTimes(0)
   })
})
