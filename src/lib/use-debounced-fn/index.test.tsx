import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useDebouncedFn from '.'

describe('use-debounced-fn', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })
   afterEach(() => {
      vi.useRealTimers()
   })

   it('should return the debounced callback', () => {
      const callback = vi.fn()
      const { result } = renderHook(() => useDebouncedFn(callback, 300))

      expect(typeof result.current).toBe('function')
   })

   it('should not fire callback on initialization', () => {
      const callback = vi.fn()
      renderHook(() => useDebouncedFn(callback, 300))

      expect(callback).not.toHaveBeenCalled()
   })

   it('should return the debounced callback with default 300ms delay', async () => {
      const callback = vi.fn()
      const { result } = renderHook(() => useDebouncedFn(callback))

      result.current(10)
      vi.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(0)

      vi.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(0)

      vi.advanceTimersByTime(100)
      expect(callback).toHaveBeenCalledTimes(1)
   })

   it('should call deboucnced function with given arguments', async () => {
      const callback = vi.fn()
      const { result } = renderHook(() => useDebouncedFn(callback))

      result.current(10)
      vi.advanceTimersByTime(300)
      expect(callback).toHaveBeenNthCalledWith(1, 10)

      result.current(30)
      vi.advanceTimersByTime(300)
      expect(callback).toHaveBeenNthCalledWith(2, 30)
   })

   it('should debounce the callback with custom delay', () => {
      const callback = vi.fn()

      const { result } = renderHook(() => useDebouncedFn(callback, 500))

      result.current(2)
      vi.advanceTimersByTime(300)
      result.current(2)
      result.current(2)
      vi.advanceTimersByTime(500)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(2)

      result.current(5)
      vi.advanceTimersByTime(500)
      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenCalledWith(2)
   })

   it('should cleanup the timers on unmount', async () => {
      const callback = vi.fn()

      const { result, unmount } = renderHook(() => useDebouncedFn(callback, 500))

      result.current()
      unmount()
      vi.advanceTimersByTime(600)
      expect(callback).toHaveBeenCalledTimes(0)
   })

   it('should sync with updated delay param and cleanup the timers with it', () => {
      let delay = 200
      const callback = vi.fn()

      const { result, rerender } = renderHook(() => useDebouncedFn(callback, delay))
      result.current()
      vi.advanceTimersByTime(200)
      expect(callback).toHaveBeenCalledTimes(1)

      // should run with updated timer
      delay = 500
      rerender()
      result.current()
      vi.advanceTimersByTime(200)
      expect(callback).toHaveBeenCalledTimes(1)
      vi.advanceTimersByTime(300)
      expect(callback).toHaveBeenCalledTimes(2)

      // should cleanup scheduled call when timer is updated
      result.current()
      delay = 1000
      rerender()
      vi.advanceTimersByTime(500)
      expect(callback).toHaveBeenCalledTimes(2)
   })

   it('callback param should be reactive', () => {
      let tempValue = 'temp'

      vi.spyOn(console, 'log')

      const callback = vi.fn(() => {
         console.log(tempValue)
      })

      const { result, rerender } = renderHook(() => useDebouncedFn(callback))

      result.current()
      vi.advanceTimersByTime(300)
      expect(callback).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith('temp')

      tempValue = 'this is temp'
      rerender()
      result.current()
      vi.advanceTimersByTime(300)
      expect(callback).toHaveBeenCalledTimes(2)
      expect(console.log).toHaveBeenCalledWith('this is temp')
   })
})
