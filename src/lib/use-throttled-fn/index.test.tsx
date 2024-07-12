import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import useThrottledFn from '.'

describe('use-throttled-fn', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })
   afterEach(() => {
      vi.useRealTimers()
   })

   it('should return the throttled callback', () => {
      const callback = vi.fn()
      const { result } = renderHook(() => useThrottledFn(callback, 300))

      expect(typeof result.current).toBe('function')
   })

   it('should not fire callback on initialization', () => {
      const callback = vi.fn()
      renderHook(() => useThrottledFn(callback, 300))

      expect(callback).not.toHaveBeenCalled()
   })

   it('should return the throttled callback with default 300ms delay', async () => {
      const callback = vi.fn()
      const { result } = renderHook(() => useThrottledFn(callback))

      result.current(10)
      expect(callback).toHaveBeenCalledTimes(1)

      result.current(10)
      vi.advanceTimersByTime(500)

      result.current(10)
      expect(callback).toHaveBeenCalledTimes(2)

      result.current(10)
      vi.advanceTimersByTime(300)
      expect(callback).toHaveBeenCalledTimes(2)

      result.current(10)
      vi.advanceTimersByTime(1000)
      expect(callback).toHaveBeenCalledTimes(3)
   })
   it('should call throttled function with given arguments', async () => {
      const callback = vi.fn()
      const { result } = renderHook(() => useThrottledFn(callback))

      result.current(10)
      vi.advanceTimersByTime(300)
      expect(callback).toHaveBeenNthCalledWith(1, 10)

      result.current(30)
      vi.advanceTimersByTime(300)
      expect(callback).toHaveBeenNthCalledWith(2, 30)
   })

   it('should throttle the callback with custom delay', async () => {
      const callback = vi.fn()

      const { result } = renderHook(() => useThrottledFn(callback, 500))

      result.current(2)
      vi.advanceTimersByTime(300)
      result.current(2)
      result.current(2)
      vi.advanceTimersByTime(500)

      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenNthCalledWith(1, 2)

      result.current(5)
      vi.advanceTimersByTime(500)
      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenNthCalledWith(2, 5)
   })

   it('should bind the this context', () => {
      let res: any = ''
      const obj = {
         details: 'this is details',
         callback: function () {
            res = this
         },
      }

      const { result } = renderHook(() => useThrottledFn(obj.callback, 500))
      result.current.call(obj)

      expect(res).toBe(obj)
   })
})
