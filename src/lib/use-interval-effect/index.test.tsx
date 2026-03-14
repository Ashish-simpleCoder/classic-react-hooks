import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useIntervalEffect from '.'

describe('use-interval-effect', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })
   afterEach(() => {
      vi.useRealTimers()
      vi.clearAllTimers()
   })

   describe('mounting', () => {
      it('should fire callback with default interval of 100ms after the mount', () => {
         const fn = vi.fn()
         renderHook(() => useIntervalEffect({ handler: fn }))

         expect(fn).not.toHaveBeenCalled()
         vi.advanceTimersByTime(99)
         expect(fn).not.toHaveBeenCalled()
         vi.advanceTimersByTime(1) // Total 100ms
         expect(fn).toHaveBeenCalledTimes(1)

         vi.advanceTimersByTime(100) // Total 200ms
         expect(fn).toHaveBeenCalledTimes(2)
      })

      it('should fire callback after the given interval', () => {
         const fn = vi.fn()
         renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         expect(fn).not.toHaveBeenCalled()
         vi.advanceTimersByTime(499)
         expect(fn).not.toHaveBeenCalled()
         vi.advanceTimersByTime(1) // Total 500ms
         expect(fn).toHaveBeenCalledTimes(1)

         vi.advanceTimersByTime(500) // Total 1000ms
         expect(fn).toHaveBeenCalledTimes(2)
      })

      it('should fire callback multiple times at regular intervals', () => {
         const fn = vi.fn()
         renderHook(() => useIntervalEffect({ handler: fn, interval: 200 }))

         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(1)

         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(2)

         vi.advanceTimersByTime(400) // two more intervals
         expect(fn).toHaveBeenCalledTimes(4)
      })
   })

   describe('unmounting', () => {
      it('should clear interval on unmount', () => {
         const fn = vi.fn()
         const { unmount } = renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         vi.advanceTimersByTime(400) // Before first interval
         unmount()
         vi.advanceTimersByTime(1000) // Advance past where intervals would have fired
         expect(fn).not.toHaveBeenCalled()
      })

      it('should not interfere with callback execution if unmounted after an interval has fired', () => {
         const fn = vi.fn()
         const { unmount } = renderHook(() => useIntervalEffect({ handler: fn, interval: 100 }))

         vi.advanceTimersByTime(100)
         expect(fn).toHaveBeenCalledTimes(1)

         unmount()
         vi.advanceTimersByTime(1000)
         expect(fn).toHaveBeenCalledTimes(1) // Should not fire again
      })
   })

   describe('clearTimer functionality', () => {
      it('should clear the interval with clearTimer', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         vi.advanceTimersByTime(200)
         result.current.clearTimer()
         vi.advanceTimersByTime(1000)
         expect(fn).not.toHaveBeenCalled()
      })

      it('should allow clearing timer multiple times without error', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         result.current.clearTimer()
         result.current.clearTimer()
         result.current.clearTimer()

         vi.advanceTimersByTime(500)
         expect(fn).not.toHaveBeenCalled()
      })

      it('should clear the interval when <interval> prop changes', () => {
         const fn = vi.fn()

         let interval = 300
         const { rerender } = renderHook(() => useIntervalEffect({ handler: fn, interval }))

         vi.advanceTimersByTime(200)
         expect(fn).not.toHaveBeenCalled()

         // Change interval, this should clear the old one and set a new one
         interval = 500
         rerender()

         vi.advanceTimersByTime(200) // Advance remaining time for old 300ms interval (100ms) + 100ms for new 500ms interval
         expect(fn).not.toHaveBeenCalled() // Old 300ms interval shouldn't fire

         vi.advanceTimersByTime(300) // Remaining for new 500ms interval
         expect(fn).toHaveBeenCalledTimes(1) // New 500ms interval fires

         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(2)
      })
   })

   describe('restartTimer functionality', () => {
      it('should restart timer with original interval', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         // Let original timer fire once
         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(1)

         // Clear and restart timer
         result.current.restartTimer()
         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(2)

         // It should continue to fire
         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(3)
      })

      it('should restart timer with new interval value provided in restartTimer function', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         // Restart with new interval before original fires
         vi.advanceTimersByTime(200) // partially advance original 500ms interval
         result.current.restartTimer(600)

         // Original interval should not fire at 500ms
         vi.advanceTimersByTime(300) // This would have been 500ms for original
         expect(fn).not.toHaveBeenCalled()

         // New 600ms interval should fire
         vi.advanceTimersByTime(300) // 300 + 300 = 600ms for new interval
         expect(fn).toHaveBeenCalledTimes(1)

         // New 600ms interval should fire again
         vi.advanceTimersByTime(600)
         expect(fn).toHaveBeenCalledTimes(2)
      })

      it('should restart timer with original value after overriding with restartTimer(new_interval)', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         vi.advanceTimersByTime(200)
         result.current.restartTimer(600) // Override with 600ms

         vi.advanceTimersByTime(600)
         expect(fn).toHaveBeenCalledTimes(1)

         // Now restart without arguments, it should pick up the original interval (500ms)
         result.current.restartTimer()

         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(2)

         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(3)
      })

      it('should cancel previous timer when restarting', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         // Restart before original interval
         vi.advanceTimersByTime(200)
         result.current.restartTimer() // Should restart with 500ms

         // Advance to where original would have fired
         vi.advanceTimersByTime(300)
         expect(fn).not.toHaveBeenCalled() // Original 500ms interval should be cancelled

         // Advance to where restarted timer should fire
         vi.advanceTimersByTime(200) // 300 + 200 = 500ms from restart
         expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should handle restart followed by clear', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useIntervalEffect({ handler: fn, interval: 500 }))

         result.current.restartTimer() // Starts a new 500ms interval
         result.current.clearTimer() // Clears it immediately
         vi.advanceTimersByTime(1000)
         expect(fn).not.toHaveBeenCalled()

         // Should be able to restart again after clearing
         result.current.restartTimer(200)
         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(1)
         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(2)
      })
   })

   describe('parameter updates', () => {
      it('should use latest handler when interval fires', () => {
         const fn1 = vi.fn()
         const fn2 = vi.fn()
         let currentHandler = fn1

         const { rerender } = renderHook(() => useIntervalEffect({ handler: currentHandler, interval: 500 }))

         // Update handler before first interval fires
         vi.advanceTimersByTime(200)
         currentHandler = fn2
         rerender()

         vi.advanceTimersByTime(300) // First interval fires
         expect(fn1).not.toHaveBeenCalled()
         expect(fn2).toHaveBeenCalledTimes(1)

         vi.advanceTimersByTime(500) // Second interval fires
         expect(fn2).toHaveBeenCalledTimes(2)
      })

      it('should use latest interval value for restartTimer', () => {
         const fn = vi.fn()
         let currentInterval = 500

         const { result, rerender } = renderHook(() => useIntervalEffect({ handler: fn, interval: currentInterval }))

         // Update interval and restart
         currentInterval = 200
         rerender() // This will clear the existing interval and set up a new one with 200ms
         result.current.restartTimer() // This should restart with the *latest* prop value (200ms)

         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(1)

         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(2)
      })
   })

   describe('error handling', () => {
      it('should not throw when handler throws an error', () => {
         const errorHandler = vi.fn(() => {
            throw new Error('Test error')
         })

         // Vitest's fake timers will re-throw the error when advanceTimersByTime is called
         // if the handler within the timer throws. So we wrap it in a try/catch or expect to throw.
         const { rerender } = renderHook(() => useIntervalEffect({ handler: errorHandler, interval: 100 }))

         expect(() => {
            vi.advanceTimersByTime(100)
         }).toThrow('Test error')
         expect(errorHandler).toHaveBeenCalledTimes(1)
      })
   })
})
