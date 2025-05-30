import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import useThrottledFn from '.'

describe('useThrottledFn', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })

   afterEach(() => {
      vi.useRealTimers()
      vi.clearAllMocks()
   })

   describe('Basic functionality', () => {
      it('should return a function', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback }))

         expect(typeof result.current).toBe('function')
      })

      it('should not call callback on initialization', () => {
         const callback = vi.fn()
         renderHook(() => useThrottledFn({ callbackToThrottle: callback }))

         expect(callback).not.toHaveBeenCalled()
      })

      it('should call callback immediately on first invocation', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback }))

         act(() => {
            result.current()
         })

         expect(callback).toHaveBeenCalledTimes(1)
      })
   })

   describe('Throttling behavior', () => {
      it('should use default delay of 300ms', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback }))

         act(() => {
            result.current()
            result.current() // Should be ignored
         })

         expect(callback).toHaveBeenCalledTimes(1)

         act(() => {
            vi.advanceTimersByTime(299)
            result.current() // Should still be ignored
         })

         expect(callback).toHaveBeenCalledTimes(1)

         act(() => {
            vi.advanceTimersByTime(1) // Total 300ms
            result.current() // Should be called
         })

         expect(callback).toHaveBeenCalledTimes(2)
      })

      it('should respect custom delay', () => {
         const callback = vi.fn()
         const customDelay = 500
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback, delay: customDelay }))

         act(() => {
            result.current()
            result.current() // Should be ignored
         })

         expect(callback).toHaveBeenCalledTimes(1)

         act(() => {
            vi.advanceTimersByTime(499)
            result.current() // Should still be ignored
         })

         expect(callback).toHaveBeenCalledTimes(1)

         act(() => {
            vi.advanceTimersByTime(1) // Total 500ms
            result.current() // Should be called
         })

         expect(callback).toHaveBeenCalledTimes(2)
      })

      it('should throttle multiple rapid calls', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback, delay: 100 }))

         act(() => {
            result.current() // Call 1 - should execute
            result.current() // Call 2 - should be throttled
            result.current() // Call 3 - should be throttled
            result.current() // Call 4 - should be throttled
         })

         expect(callback).toHaveBeenCalledTimes(1)

         act(() => {
            vi.advanceTimersByTime(100)
            result.current() // Call 5 - should execute
         })

         expect(callback).toHaveBeenCalledTimes(2)
      })

      it('should allow execution after delay has passed', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback, delay: 200 }))

         act(() => {
            result.current()
         })
         expect(callback).toHaveBeenCalledTimes(1)

         act(() => {
            vi.advanceTimersByTime(200)
            result.current()
         })
         expect(callback).toHaveBeenCalledTimes(2)

         act(() => {
            vi.advanceTimersByTime(200)
            result.current()
         })
         expect(callback).toHaveBeenCalledTimes(3)
      })
   })

   describe('Arguments handling', () => {
      it('should pass arguments correctly to the callback', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback }))

         act(() => {
            result.current('arg1', 'arg2', 123)
         })

         expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123)
      })

      it('should pass different arguments on subsequent calls', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback, delay: 100 }))

         act(() => {
            result.current('first')
         })
         expect(callback).toHaveBeenNthCalledWith(1, 'first')

         act(() => {
            vi.advanceTimersByTime(100)
            result.current('second')
         })
         expect(callback).toHaveBeenNthCalledWith(2, 'second')
      })
   })

   describe('Context binding', () => {
      it('should preserve this context when called with call()', () => {
         let capturedThis: any = null
         const testObj = {
            name: 'test',
            callback: function () {
               capturedThis = this
            },
         }

         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: testObj.callback }))

         act(() => {
            result.current.call(testObj)
         })

         expect(capturedThis).toBe(testObj)
      })

      it('should preserve this context when called with apply()', () => {
         let capturedThis: any = null
         const testObj = {
            name: 'test',
            callback: function (arg: string) {
               capturedThis = this
               return arg
            },
         }

         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: testObj.callback }))

         act(() => {
            result.current.apply(testObj, ['test-arg'])
         })

         expect(capturedThis).toBe(testObj)
      })
   })

   describe('Hook updates and re-renders', () => {
      it('should update callback when it changes', () => {
         const callback1 = vi.fn()
         const callback2 = vi.fn()

         const { result, rerender } = renderHook(({ callback }) => useThrottledFn({ callbackToThrottle: callback }), {
            initialProps: { callback: callback1 },
         })

         act(() => {
            result.current()
         })
         expect(callback1).toHaveBeenCalledTimes(1)
         expect(callback2).not.toHaveBeenCalled()

         // Update the callback
         rerender({ callback: callback2 })

         act(() => {
            vi.advanceTimersByTime(300)
            result.current()
         })
         expect(callback1).toHaveBeenCalledTimes(1)
         expect(callback2).toHaveBeenCalledTimes(1)
      })

      it('should update delay when it changes', () => {
         const callback = vi.fn()

         const { result, rerender } = renderHook(
            ({ delay }) => useThrottledFn({ callbackToThrottle: callback, delay }),
            { initialProps: { delay: 100 } }
         )

         act(() => {
            result.current()
         })
         expect(callback).toHaveBeenCalledTimes(1)

         // Update delay
         rerender({ delay: 500 })

         act(() => {
            vi.advanceTimersByTime(100) // Old delay
            result.current() // Should still be throttled with new delay
         })
         expect(callback).toHaveBeenCalledTimes(1)

         act(() => {
            vi.advanceTimersByTime(400) // Total 500ms (new delay)
            result.current()
         })
         expect(callback).toHaveBeenCalledTimes(2)
      })

      it('should maintain throttle state across re-renders', () => {
         const callback = vi.fn()

         const { result, rerender } = renderHook(() => useThrottledFn({ callbackToThrottle: callback, delay: 200 }))

         act(() => {
            result.current()
         })
         expect(callback).toHaveBeenCalledTimes(1)

         // Re-render the component
         rerender()

         act(() => {
            result.current() // Should still be throttled
         })
         expect(callback).toHaveBeenCalledTimes(1)

         act(() => {
            vi.advanceTimersByTime(200)
            result.current() // Should now execute
         })
         expect(callback).toHaveBeenCalledTimes(2)
      })
   })

   describe('Error handling', () => {
      it('should handle callback that throws an error', () => {
         const errorCallback = vi.fn(() => {
            throw new Error('Test error')
         })
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: errorCallback }))

         expect(() => {
            act(() => {
               result.current()
            })
         }).toThrow('Test error')

         expect(errorCallback).toHaveBeenCalledTimes(1)

         // Should still throttle after error
         expect(() => {
            act(() => {
               result.current()
            })
         }).not.toThrow()

         expect(errorCallback).toHaveBeenCalledTimes(1) // Still throttled
      })
   })

   describe('Performance and memory', () => {
      it('should not create new throttled function on every render', () => {
         const callback = vi.fn()
         const { result, rerender } = renderHook(() => useThrottledFn({ callbackToThrottle: callback }))

         const firstDebouncedFn = result.current
         rerender()
         const secondDebouncedFn = result.current

         expect(firstDebouncedFn).toBe(secondDebouncedFn)
      })
   })

   describe('Memory and performance', () => {
      it('should not create new throttled function on every render', () => {
         const callback = vi.fn()
         const { result, rerender } = renderHook(() => useThrottledFn({ callbackToThrottle: callback }))

         const firstThrottledFn = result.current
         rerender()
         const secondThrottledFn = result.current

         expect(firstThrottledFn).toBe(secondThrottledFn)
      })

      it('should handle rapid successive calls efficiently', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useThrottledFn({ callbackToThrottle: callback, delay: 100 }))

         act(() => {
            // Simulate rapid calls
            for (let i = 0; i < 1000; i++) {
               result.current(i)
            }
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith(0) // First call's argument

         act(() => {
            vi.advanceTimersByTime(100)
            result.current(1001)
         })

         expect(callback).toHaveBeenCalledTimes(2)
         expect(callback).toHaveBeenNthCalledWith(2, 1001)
      })
   })
})
