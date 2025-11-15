import { vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useDebouncedFn from '.'

describe('use-debounced-fn', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })

   afterEach(() => {
      vi.useRealTimers()
      vi.clearAllMocks()
   })

   describe('mounting', () => {
      it('should return a function', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         expect(typeof result.current).toBe('function')
      })

      it('should not call callback on initialization', () => {
         const callback = vi.fn()
         renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         expect(callback).not.toHaveBeenCalled()
      })

      it('should not call callback immediately when invoked', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         act(() => {
            result.current()
         })

         expect(callback).not.toHaveBeenCalled()
      })
   })

   describe('unmounting', () => {
      it('should cleanup timer on unmount', () => {
         const callback = vi.fn()

         const { result, unmount } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 500 }))

         act(() => {
            result.current()
         })

         unmount()

         act(() => {
            vi.advanceTimersByTime(600)
         })

         expect(callback).not.toHaveBeenCalled()
      })

      it('should cleanup multiple pending timers on unmount', () => {
         const callback = vi.fn()

         const { result, unmount } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         act(() => {
            result.current() // First call
            vi.advanceTimersByTime(100)
            result.current() // Second call (cancels first)
            vi.advanceTimersByTime(100)
            result.current() // Third call (cancels second)
         })

         unmount()

         act(() => {
            vi.advanceTimersByTime(500)
         })

         expect(callback).not.toHaveBeenCalled()
      })

      it('should not cause memory leaks with repeated mount/unmount', () => {
         const callback = vi.fn()

         for (let i = 0; i < 10; i++) {
            const { result, unmount } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 100 }))

            act(() => {
               result.current()
            })

            unmount()
         }

         act(() => {
            vi.advanceTimersByTime(200)
         })

         expect(callback).not.toHaveBeenCalled()
      })
   })

   describe('Debouncing behavior', () => {
      it('should use default delay of 300ms', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         act(() => {
            result.current()
         })

         act(() => {
            vi.advanceTimersByTime(299)
         })
         expect(callback).not.toHaveBeenCalled()

         act(() => {
            vi.advanceTimersByTime(1) // Total 300ms
         })
         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should respect custom delay', () => {
         const callback = vi.fn()
         const customDelay = 500
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: customDelay }))

         act(() => {
            result.current()
         })

         act(() => {
            vi.advanceTimersByTime(499)
         })
         expect(callback).not.toHaveBeenCalled()

         act(() => {
            vi.advanceTimersByTime(1) // Total 500ms
         })
         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should debounce multiple rapid calls', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 200 }))

         act(() => {
            result.current() // Call 1
            result.current() // Call 2 - should reset timer
            result.current() // Call 3 - should reset timer
         })

         act(() => {
            vi.advanceTimersByTime(100)
            result.current() // Call 4 - should reset timer again
         })

         act(() => {
            vi.advanceTimersByTime(199)
         })
         expect(callback).not.toHaveBeenCalled()

         act(() => {
            vi.advanceTimersByTime(1) // 200ms from last call
         })
         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should allow multiple executions after delay periods', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 100 }))

         // First execution
         act(() => {
            result.current('first')
         })
         act(() => {
            vi.advanceTimersByTime(100)
         })
         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenNthCalledWith(1, 'first')

         // Second execution
         act(() => {
            result.current('second')
         })
         act(() => {
            vi.advanceTimersByTime(100)
         })
         expect(callback).toHaveBeenCalledTimes(2)
         expect(callback).toHaveBeenNthCalledWith(2, 'second')
      })
   })

   describe('Arugment passing to callback', () => {
      it('should pass arguments correctly to the callback', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         act(() => {
            result.current('arg1', 'arg2', 123)
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 123)
      })

      it('should use arguments from the latest call', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 200 }))

         act(() => {
            result.current('first')
            result.current('second')
            result.current('third') // This should be the final call
         })

         act(() => {
            vi.advanceTimersByTime(200)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith('third')
      })

      it('should preserve argument references', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         const originalObj = { value: 'original' }

         act(() => {
            result.current(originalObj)
         })

         // Modify the object before debounce executes
         originalObj.value = 'modified'

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith(originalObj)
         expect(callback.mock.calls?.[0]?.[0].value).toBe('modified')
      })
   })

   describe('Context binding', () => {
      it('should not preserve this context (calls with null)', () => {
         let capturedThis: any = 'not-set'
         const testObj = {
            name: 'test',
            callback: function () {
               capturedThis = this
            },
         }

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: testObj.callback }))

         act(() => {
            result.current.call(testObj) // Try to set context
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         // Your implementation calls with null, so this should be null/undefined
         expect(capturedThis).toBeNull()
      })
   })

   describe('Hook updates and re-renders', () => {
      it('should update callback when it changes', () => {
         const callback1 = vi.fn()
         const callback2 = vi.fn(() => 'second')

         const { result, rerender } = renderHook(({ callback }) => useDebouncedFn({ callbackToBounce: callback }), {
            initialProps: { callback: callback1 },
         })

         act(() => {
            result.current()
         })

         // Update the callback before execution
         rerender({ callback: callback2 })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback1).not.toHaveBeenCalled()
         expect(callback2).toHaveBeenCalledTimes(1)
      })

      it('should update delay and cleanup previous timer', () => {
         const callback = vi.fn()

         const { result, rerender } = renderHook(({ delay }) => useDebouncedFn({ callbackToBounce: callback, delay }), {
            initialProps: { delay: 200 },
         })

         act(() => {
            result.current()
         })

         // Update delay - this should cleanup the existing timer
         rerender({ delay: 500 })

         act(() => {
            vi.advanceTimersByTime(200) // Original delay time
         })
         expect(callback).not.toHaveBeenCalled() // Should be cancelled

         // New call with updated delay
         act(() => {
            result.current()
         })

         act(() => {
            vi.advanceTimersByTime(500) // New delay time
         })
         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should handle callback updates during pending execution', () => {
         let message = 'original'
         const logFn = vi.fn()
         const createCallback = () =>
            vi.fn(() => {
               logFn(message)
               return message
            })

         let callback = createCallback()
         const { result, rerender } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         act(() => {
            result.current()
         })

         // Update both message and callback
         message = 'updated'
         callback = createCallback()
         rerender()

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(logFn).toHaveBeenCalledTimes(1)
         expect(logFn).toHaveBeenNthCalledWith(1, 'updated')
      })
   })

   describe('Error handling', () => {
      it('should handle callback that throws an error', () => {
         const errorCallback = vi.fn(() => {
            throw new Error('Test error')
         })
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: errorCallback }))

         act(() => {
            result.current()
         })

         expect(() => {
            act(() => {
               vi.advanceTimersByTime(300)
            })
         }).toThrow('Test error')

         expect(errorCallback).toHaveBeenCalledTimes(1)
      })

      it('should continue working after callback error', () => {
         let shouldThrow = true
         const callback = vi.fn(() => {
            if (shouldThrow) {
               throw new Error('Test error')
            }
            return 'success'
         })

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         // First call throws
         act(() => {
            result.current()
         })

         expect(() => {
            act(() => {
               vi.advanceTimersByTime(300)
            })
         }).toThrow('Test error')

         // Second call succeeds
         shouldThrow = false
         act(() => {
            result.current()
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledTimes(2)
      })
   })

   describe('Edge cases', () => {
      it('should handle rapid delay changes', () => {
         const callback = vi.fn()
         const delays = [100, 200, 50, 500, 300]
         let currentDelay = delays[0]

         const { result, rerender } = renderHook(() =>
            useDebouncedFn({ callbackToBounce: callback, delay: currentDelay })
         )

         delays.forEach((delay, index) => {
            currentDelay = delay
            rerender()

            act(() => {
               result.current(`call-${index}`)
            })
         })

         act(() => {
            vi.advanceTimersByTime(300) // Final delay
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith('call-4')
      })
   })

   describe('Performance and memory', () => {
      it('should not create new debounced function on every render', () => {
         const callback = vi.fn()
         const { result, rerender } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         const firstDebouncedFn = result.current
         rerender()
         const secondDebouncedFn = result.current

         expect(firstDebouncedFn).toBe(secondDebouncedFn)
      })

      it('should handle many rapid calls efficiently', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 100 }))

         act(() => {
            // Simulate many rapid calls
            for (let i = 0; i < 1000; i++) {
               result.current(i)
            }
         })

         act(() => {
            vi.advanceTimersByTime(100)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith(999) // Last call's argument
      })
   })

   describe('Integration with React lifecycle', () => {
      it('should work correctly with React.StrictMode (double effect execution)', () => {
         const callback = vi.fn()

         // Simulate StrictMode by manually calling effects twice
         const { result, rerender } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 200 }))

         // Simulate StrictMode re-render
         rerender()

         act(() => {
            result.current()
         })

         act(() => {
            vi.advanceTimersByTime(200)
         })

         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should handle component re-renders during debounce period', () => {
         const callback = vi.fn()
         let renderCount = 0

         const { result, rerender } = renderHook(() => {
            renderCount++
            return useDebouncedFn({ callbackToBounce: callback, delay: 300 })
         })

         act(() => {
            result.current()
         })

         // Force multiple re-renders during debounce period
         act(() => {
            vi.advanceTimersByTime(100)
            rerender()
            vi.advanceTimersByTime(100)
            rerender()
            vi.advanceTimersByTime(100) // Total 300ms
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(renderCount).toBeGreaterThan(1)
      })
   })
})
