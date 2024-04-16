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

   it('should debounce the callback with custom delay', async () => {
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
})
