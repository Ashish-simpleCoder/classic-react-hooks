import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useTimeoutEffect from '.' // Fixed typo in import

describe('useTimeoutEffect', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })

   afterEach(() => {
      vi.useRealTimers()
      vi.clearAllTimers()
   })

   describe('basic functionality', () => {
      it('should fire callback with default timeout of 100ms after mount', () => {
         const fn = vi.fn()
         renderHook(() => useTimeoutEffect({ handler: fn }))

         expect(fn).not.toHaveBeenCalled()
         vi.advanceTimersByTime(99)
         expect(fn).not.toHaveBeenCalled()
         vi.advanceTimersByTime(1)
         expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should fire callback with specified timeout prop', () => {
         const fn = vi.fn()
         renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         expect(fn).not.toHaveBeenCalled()
         vi.advanceTimersByTime(499)
         expect(fn).not.toHaveBeenCalled()
         vi.advanceTimersByTime(1)
         expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should only fire callback once', () => {
         const fn = vi.fn()
         renderHook(() => useTimeoutEffect({ handler: fn, timeout: 100 }))

         vi.advanceTimersByTime(100)
         expect(fn).toHaveBeenCalledTimes(1)

         // Advance more time to ensure it doesn't fire again
         vi.advanceTimersByTime(1000)
         expect(fn).toHaveBeenCalledTimes(1)
      })
   })

   describe('clearTimer functionality', () => {
      it('should clear the timeout with clearTimer before timeout expires', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         vi.advanceTimersByTime(200)
         result.current.clearTimer()
         vi.advanceTimersByTime(500)
         expect(fn).not.toHaveBeenCalled()
      })

      it('should allow clearing timer multiple times without error', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         result.current.clearTimer()
         result.current.clearTimer()
         result.current.clearTimer()

         vi.advanceTimersByTime(500)
         expect(fn).not.toHaveBeenCalled()
      })
   })

   describe('restartTimer functionality', () => {
      it('should restart timer with original timeout', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         // Let original timer fire
         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(1)

         // Restart timer
         result.current.restartTimer()
         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(2)
      })

      it('should restart timer with new timeout value provided in restartTimer function', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         // Restart with new timeout before original fires
         vi.advanceTimersByTime(200)
         result.current.restartTimer(600)

         // Original timeout should not fire
         vi.advanceTimersByTime(500)
         expect(fn).not.toHaveBeenCalled()

         // New timeout should fire
         vi.advanceTimersByTime(100) // 500 + 100 = 600
         expect(fn).toHaveBeenCalledTimes(1)
      })
      it('should restart timer with original value after overriding of timer with restartTimer function', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         // Restart with new timeout before original fires
         vi.advanceTimersByTime(200)
         result.current.restartTimer(600)

         // Original timeout should not fire
         vi.advanceTimersByTime(500)
         expect(fn).not.toHaveBeenCalled()

         // New timeout should fire
         vi.advanceTimersByTime(100) // 500 + 100 = 600
         expect(fn).toHaveBeenCalledTimes(1)

         // will pickup the original timer value = 500
         result.current.restartTimer()

         // Fire after 500ms
         vi.advanceTimersByTime(500)
         expect(fn).toHaveBeenCalledTimes(2)
      })

      it('should cancel previous timer when restarting', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         // Restart before original timeout
         vi.advanceTimersByTime(200)
         result.current.restartTimer()

         // Advance to where original would have fired
         vi.advanceTimersByTime(300)
         expect(fn).not.toHaveBeenCalled()

         // Advance to where restarted timer should fire
         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(1)
      })

      it('should handle restart followed by clear', () => {
         const fn = vi.fn()
         const { result } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         result.current.restartTimer()
         result.current.clearTimer()
         vi.advanceTimersByTime(1000)
         expect(fn).not.toHaveBeenCalled()

         // Should be able to restart again after clearing
         result.current.restartTimer(200)
         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(1)
      })
   })

   describe('component lifecycle', () => {
      it('should clear timeout on unmount before timeout expires', () => {
         const fn = vi.fn()
         const { unmount } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 500 }))

         vi.advanceTimersByTime(200)
         unmount()
         vi.advanceTimersByTime(500)
         expect(fn).not.toHaveBeenCalled()
      })

      it('should not interfere with callback execution if unmounted after timeout', () => {
         const fn = vi.fn()
         const { unmount } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: 100 }))

         vi.advanceTimersByTime(100)
         expect(fn).toHaveBeenCalledTimes(1)

         unmount()
         vi.advanceTimersByTime(1000)
         expect(fn).toHaveBeenCalledTimes(1)
      })
   })

   describe('parameter updates', () => {
      it('should use latest handler when timeout fires', () => {
         const fn1 = vi.fn()
         const fn2 = vi.fn()
         let currentHandler = fn1

         const { rerender } = renderHook(() => useTimeoutEffect({ handler: currentHandler, timeout: 500 }))

         // Update handler before timeout fires
         vi.advanceTimersByTime(200)
         currentHandler = fn2
         rerender()

         vi.advanceTimersByTime(300)
         expect(fn1).not.toHaveBeenCalled()
         expect(fn2).toHaveBeenCalledTimes(1)
      })

      it('should use latest timeout value for restartTimer', () => {
         const fn = vi.fn()
         let currentTimeout = 500

         const { result, rerender } = renderHook(() => useTimeoutEffect({ handler: fn, timeout: currentTimeout }))

         // Update timeout and restart
         currentTimeout = 200
         rerender()
         result.current.restartTimer()

         vi.advanceTimersByTime(200)
         expect(fn).toHaveBeenCalledTimes(1)
      })
   })

   describe('edge cases', () => {
      it('should not throw when handler throws an error', () => {
         const errorHandler = vi.fn(() => {
            throw new Error('Test error')
         })

         expect(() => {
            renderHook(() => useTimeoutEffect({ handler: errorHandler, timeout: 100 }))
            vi.advanceTimersByTime(100)
         }).toThrow('Test error')

         expect(errorHandler).toHaveBeenCalledTimes(1)
      })
   })
})
