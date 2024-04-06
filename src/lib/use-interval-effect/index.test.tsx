import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useIntervalEffect from '.'

describe('use-interval-effect', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })
   afterEach(() => {
      vi.useRealTimers()
   })
   afterEach(() => {
      vi.clearAllTimers()
   })

   it('should fire callback with default interval of 100ms after the mount', () => {
      const fn = vi.fn()
      renderHook(() => useIntervalEffect(fn))

      expect(fn).toHaveBeenCalledTimes(0)
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
   })

   it('should fire callback after the given interval', () => {
      const fn = vi.fn()
      renderHook(() => useIntervalEffect(fn, 500))

      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(1)

      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(2)
   })

   it('should clear the interval with clearTimer', () => {
      const fn = vi.fn()
      const { result } = renderHook(() => useIntervalEffect(fn, 500))

      result.current.clearTimer()
      vi.advanceTimersByTime(500)
      expect(fn).not.toHaveBeenCalled()
   })

   it('should set the interval with restartTimer', () => {
      const fn = vi.fn()
      const { result } = renderHook(() => useIntervalEffect(fn, 500))

      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(1)

      result.current.clearTimer()
      vi.advanceTimersByTime(500)
      vi.advanceTimersByTime(500)
      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(1)

      // restart
      result.current.restartTimer()
      vi.advanceTimersByTime(500)
      expect(fn).toHaveBeenCalledTimes(2)
   })

   it('should clear interval on unmount', () => {
      const fn = vi.fn()
      const { unmount, result } = renderHook(() => useIntervalEffect(fn, 500))
      // cleanup the timer
      vi.advanceTimersByTime(400)
      unmount()
      expect(fn).toHaveBeenCalledTimes(0)
   })
})
