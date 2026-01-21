import { vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebouncedFn } from '.'

describe('use-debounced-fn', () => {
   beforeEach(() => {
      vi.useFakeTimers()
   })

   afterEach(() => {
      vi.useRealTimers()
      vi.clearAllMocks()
   })

   describe('mounting', () => {
      it('should return an object with debouncedFn and cleanup functions', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         expect(typeof result.current.debouncedFn).toBe('function')
         expect(typeof result.current.cleanup).toBe('function')
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
            result.current.debouncedFn()
         })

         expect(callback).not.toHaveBeenCalled()
      })
   })

   describe('unmounting', () => {
      it('should cleanup timer on unmount', () => {
         const callback = vi.fn()

         const { result, unmount } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 500 }))

         act(() => {
            result.current.debouncedFn()
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
            result.current.debouncedFn() // First call
            vi.advanceTimersByTime(100)
            result.current.debouncedFn() // Second call (cancels first)
            vi.advanceTimersByTime(100)
            result.current.debouncedFn() // Third call (cancels second)
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
               result.current.debouncedFn()
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
            result.current.debouncedFn()
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
            result.current.debouncedFn()
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
            result.current.debouncedFn() // Call 1
            result.current.debouncedFn() // Call 2 - should reset timer
            result.current.debouncedFn() // Call 3 - should reset timer
         })

         act(() => {
            vi.advanceTimersByTime(100)
            result.current.debouncedFn() // Call 4 - should reset timer again
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
            result.current.debouncedFn('first')
         })
         act(() => {
            vi.advanceTimersByTime(100)
         })
         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenNthCalledWith(1, 'first')

         // Second execution
         act(() => {
            result.current.debouncedFn('second')
         })
         act(() => {
            vi.advanceTimersByTime(100)
         })
         expect(callback).toHaveBeenCalledTimes(2)
         expect(callback).toHaveBeenNthCalledWith(2, 'second')
      })
   })

   describe('Argument passing to callback', () => {
      it('should pass arguments correctly to the callback', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         act(() => {
            result.current.debouncedFn('arg1', 'arg2', 123)
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
            result.current.debouncedFn('first')
            result.current.debouncedFn('second')
            result.current.debouncedFn('third') // This should be the final call
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
            result.current.debouncedFn(originalObj)
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

   describe('immediateCallback', () => {
      it('should call immediateCallback synchronously', () => {
         const immediate = vi.fn()
         const callback = vi.fn()
         const { result } = renderHook(() =>
            useDebouncedFn({ immediateCallback: immediate, callbackToBounce: callback, delay: 300 })
         )

         act(() => {
            result.current.debouncedFn('test')
         })

         expect(immediate).toHaveBeenCalledTimes(1)
         expect(immediate).toHaveBeenCalledWith('test')
         expect(callback).not.toHaveBeenCalled()
      })

      it('should call immediateCallback on every invocation', () => {
         const immediate = vi.fn()
         const callback = vi.fn()
         const { result } = renderHook(() =>
            useDebouncedFn({ immediateCallback: immediate, callbackToBounce: callback, delay: 200 })
         )

         act(() => {
            result.current.debouncedFn('first')
            result.current.debouncedFn('second')
            result.current.debouncedFn('third')
         })

         expect(immediate).toHaveBeenCalledTimes(3)
         expect(immediate).toHaveBeenNthCalledWith(1, 'first')
         expect(immediate).toHaveBeenNthCalledWith(2, 'second')
         expect(immediate).toHaveBeenNthCalledWith(3, 'third')
         expect(callback).not.toHaveBeenCalled()

         act(() => {
            vi.advanceTimersByTime(200)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith('third')
      })

      it('should pass all arguments to immediateCallback', () => {
         const immediate = vi.fn()
         const callback = vi.fn()
         const { result } = renderHook(() =>
            useDebouncedFn({ immediateCallback: immediate, callbackToBounce: callback })
         )

         act(() => {
            result.current.debouncedFn('arg1', 42, { key: 'value' })
         })

         expect(immediate).toHaveBeenCalledWith('arg1', 42, { key: 'value' })
      })

      it('should work without immediateCallback', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('test')
      })
   })

   describe('onSuccess', () => {
      it('should call onSuccess after sync callbackToBounce completes', () => {
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess, delay: 300 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('test')
         expect(onSuccess).toHaveBeenCalledWith('test')
         expect(callback).toHaveBeenCalledBefore(onSuccess)
      })

      it('should call onSuccess after async callbackToBounce completes', async () => {
         const callback = vi.fn(async (val: string) => {
            await new Promise((resolve) => setTimeout(resolve, 100))
            return val
         })
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess, delay: 300 }))

         act(() => {
            result.current.debouncedFn('async-test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('async-test')

         // Advance timers for the async operation
         await act(async () => {
            vi.advanceTimersByTime(100)
            await Promise.resolve()
         })

         expect(onSuccess).toHaveBeenCalledWith('async-test')
      })

      it('should pass same arguments to onSuccess', () => {
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess }))

         act(() => {
            result.current.debouncedFn('arg1', 123, { nested: true })
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onSuccess).toHaveBeenCalledWith('arg1', 123, { nested: true })
      })

      it('should work without onSuccess', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('test')
      })

      it('should not call onSuccess if execution is cancelled', () => {
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess, delay: 300 }))

         act(() => {
            result.current.debouncedFn('first')
         })

         act(() => {
            vi.advanceTimersByTime(100)
            result.current.debouncedFn('second') // Cancels first
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith('second')
         expect(onSuccess).toHaveBeenCalledTimes(1)
         expect(onSuccess).toHaveBeenCalledWith('second')
      })
   })

   describe('onError', () => {
      it('should call onError when callbackToBounce throws synchronously', () => {
         const error = new Error('Test error')
         const callback = vi.fn(() => {
            throw error
         })
         const onError = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError, delay: 300 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('test')
         expect(onError).toHaveBeenCalledWith(error, 'test')
      })

      it('should pass all arguments to onError', () => {
         const error = new Error('Test error')
         const callback = vi.fn(() => {
            throw error
         })
         const onError = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError }))

         act(() => {
            result.current.debouncedFn('arg1', 42, { key: 'value' })
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError).toHaveBeenCalledWith(error, 'arg1', 42, { key: 'value' })
      })

      it('should not call onSuccess when onError is called', () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onSuccess = vi.fn()
         const onError = vi.fn()
         const { result } = renderHook(() =>
            useDebouncedFn({ callbackToBounce: callback, onSuccess, onError, delay: 300 })
         )

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError).toHaveBeenCalled()
         expect(onSuccess).not.toHaveBeenCalled()
      })

      it('should work without onError (error is not caught)', () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         act(() => {
            result.current.debouncedFn('test')
         })

         // Error is thrown but not caught
         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('test')
      })

      it('should not call onError if execution is cancelled', () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onError = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError, delay: 300 }))

         act(() => {
            result.current.debouncedFn('first')
         })

         act(() => {
            vi.advanceTimersByTime(100)
            result.current.debouncedFn('second') // Cancels first
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError).toHaveBeenCalledTimes(1)
         expect(onError).toHaveBeenCalledWith(expect.any(Error), 'second')
      })
   })

   describe('onFinally', () => {
      it('should call onFinally after successful execution', () => {
         const callback = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally, delay: 300 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('test')
         expect(onFinally).toHaveBeenCalledWith('test')
      })

      it('should call onFinally after error', () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally, delay: 300 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onFinally).toHaveBeenCalledWith('test')
      })

      it('should call onFinally with all arguments', () => {
         const callback = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally }))

         act(() => {
            result.current.debouncedFn('arg1', 42, { key: 'value' })
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onFinally).toHaveBeenCalledWith('arg1', 42, { key: 'value' })
      })

      it('should work without onFinally', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('test')
      })

      it('should not call onFinally if execution is cancelled', () => {
         const callback = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally, delay: 300 }))

         act(() => {
            result.current.debouncedFn('first')
         })

         act(() => {
            vi.advanceTimersByTime(100)
            result.current.debouncedFn('second') // Cancels first
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onFinally).toHaveBeenCalledTimes(1)
         expect(onFinally).toHaveBeenCalledWith('second')
      })
   })

   describe('All callbacks together', () => {
      it('should execute callbacks in correct order: immediate -> debounced -> success -> finally', () => {
         const executionOrder: string[] = []
         const immediate = vi.fn(() => executionOrder.push('immediate'))
         const callback = vi.fn(() => executionOrder.push('debounced'))
         const onSuccess = vi.fn(() => executionOrder.push('success'))
         const onFinally = vi.fn(() => executionOrder.push('finally'))

         const { result } = renderHook(() =>
            useDebouncedFn({
               immediateCallback: immediate,
               callbackToBounce: callback,
               onSuccess,
               onFinally,
               delay: 300,
            })
         )

         act(() => {
            result.current.debouncedFn('test')
         })

         expect(executionOrder).toEqual(['immediate'])

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(executionOrder).toEqual(['immediate', 'debounced', 'success', 'finally'])
      })

      it('should execute callbacks in correct order on error: immediate -> debounced -> error -> finally', () => {
         const executionOrder: string[] = []
         const immediate = vi.fn(() => executionOrder.push('immediate'))
         const callback = vi.fn(() => {
            executionOrder.push('debounced')
            throw new Error('Test error')
         })
         const onError = vi.fn(() => executionOrder.push('error'))
         const onFinally = vi.fn(() => executionOrder.push('finally'))

         const { result } = renderHook(() =>
            useDebouncedFn({
               immediateCallback: immediate,
               callbackToBounce: callback,
               onError,
               onFinally,
               delay: 300,
            })
         )

         act(() => {
            result.current.debouncedFn('test')
         })

         expect(executionOrder).toEqual(['immediate'])

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(executionOrder).toEqual(['immediate', 'debounced', 'error', 'finally'])
      })

      it('should pass same arguments to all callbacks', () => {
         const immediate = vi.fn()
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const onFinally = vi.fn()

         const { result } = renderHook(() =>
            useDebouncedFn({
               immediateCallback: immediate,
               callbackToBounce: callback,
               onSuccess,
               onFinally,
            })
         )

         const testObj = { id: 1, name: 'test' }

         act(() => {
            result.current.debouncedFn(testObj, 'extra', 42)
         })

         expect(immediate).toHaveBeenCalledWith(testObj, 'extra', 42)

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith(testObj, 'extra', 42)
         expect(onSuccess).toHaveBeenCalledWith(testObj, 'extra', 42)
         expect(onFinally).toHaveBeenCalledWith(testObj, 'extra', 42)
      })

      it('should pass same arguments to error and finally callbacks', () => {
         const immediate = vi.fn()
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onError = vi.fn()
         const onFinally = vi.fn()

         const { result } = renderHook(() =>
            useDebouncedFn({
               immediateCallback: immediate,
               callbackToBounce: callback,
               onError,
               onFinally,
            })
         )

         const testObj = { id: 1, name: 'test' }

         act(() => {
            result.current.debouncedFn(testObj, 'extra', 42)
         })

         expect(immediate).toHaveBeenCalledWith(testObj, 'extra', 42)

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError).toHaveBeenCalledWith(expect.any(Error), testObj, 'extra', 42)
         expect(onFinally).toHaveBeenCalledWith(testObj, 'extra', 42)
      })
   })

   describe('Manual cleanup', () => {
      it('should cancel pending execution when cleanup is called', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(100)
            result.current.cleanup()
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).not.toHaveBeenCalled()
      })

      it('should not call onSuccess when cleanup cancels execution', () => {
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess, delay: 300 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            result.current.cleanup()
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).not.toHaveBeenCalled()
         expect(onSuccess).not.toHaveBeenCalled()
      })

      it('should not call onFinally when cleanup cancels execution', () => {
         const callback = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally, delay: 300 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            result.current.cleanup()
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).not.toHaveBeenCalled()
         expect(onFinally).not.toHaveBeenCalled()
      })

      it('should allow new calls after cleanup', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         act(() => {
            result.current.debouncedFn('first')
            result.current.cleanup()
         })

         act(() => {
            result.current.debouncedFn('second')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith('second')
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
            result.current.debouncedFn.call(testObj) // Try to set context
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

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
            result.current.debouncedFn()
         })

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
            result.current.debouncedFn()
         })

         rerender({ delay: 500 })

         act(() => {
            vi.advanceTimersByTime(200)
         })
         expect(callback).not.toHaveBeenCalled()

         act(() => {
            result.current.debouncedFn()
         })

         act(() => {
            vi.advanceTimersByTime(500)
         })
         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should update immediateCallback when it changes', () => {
         const immediate1 = vi.fn()
         const immediate2 = vi.fn()
         const callback = vi.fn()

         const { result, rerender } = renderHook(
            ({ immediate }) => useDebouncedFn({ immediateCallback: immediate, callbackToBounce: callback }),
            { initialProps: { immediate: immediate1 } }
         )

         act(() => {
            result.current.debouncedFn('test1')
         })

         expect(immediate1).toHaveBeenCalledWith('test1')

         rerender({ immediate: immediate2 })

         act(() => {
            result.current.debouncedFn('test2')
         })

         expect(immediate2).toHaveBeenCalledWith('test2')
         expect(immediate1).toHaveBeenCalledTimes(1)
      })

      it('should update onSuccess when it changes', () => {
         const callback = vi.fn()
         const onSuccess1 = vi.fn()
         const onSuccess2 = vi.fn()

         const { result, rerender } = renderHook(
            ({ onSuccess }) => useDebouncedFn({ callbackToBounce: callback, onSuccess }),
            { initialProps: { onSuccess: onSuccess1 } }
         )

         act(() => {
            result.current.debouncedFn('test1')
         })

         rerender({ onSuccess: onSuccess2 })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onSuccess1).not.toHaveBeenCalled()
         expect(onSuccess2).toHaveBeenCalledWith('test1')
      })

      it('should update onError when it changes', () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onError1 = vi.fn()
         const onError2 = vi.fn()

         const { result, rerender } = renderHook(
            ({ onError }) => useDebouncedFn({ callbackToBounce: callback, onError }),
            { initialProps: { onError: onError1 } }
         )

         act(() => {
            result.current.debouncedFn('test1')
         })

         rerender({ onError: onError2 })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError1).not.toHaveBeenCalled()
         expect(onError2).toHaveBeenCalledWith(expect.any(Error), 'test1')
      })

      it('should update onFinally when it changes', () => {
         const callback = vi.fn()
         const onFinally1 = vi.fn()
         const onFinally2 = vi.fn()

         const { result, rerender } = renderHook(
            ({ onFinally }) => useDebouncedFn({ callbackToBounce: callback, onFinally }),
            { initialProps: { onFinally: onFinally1 } }
         )

         act(() => {
            result.current.debouncedFn('test1')
         })

         rerender({ onFinally: onFinally2 })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onFinally1).not.toHaveBeenCalled()
         expect(onFinally2).toHaveBeenCalledWith('test1')
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
            result.current.debouncedFn()
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
      it('should handle callback that throws an error without onError', () => {
         const errorCallback = vi.fn(() => {
            throw new Error('Test error')
         })
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: errorCallback }))

         act(() => {
            result.current.debouncedFn()
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

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
         const onError = vi.fn()

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError }))

         // First call throws
         act(() => {
            result.current.debouncedFn()
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError).toHaveBeenCalled()

         // Second call succeeds
         shouldThrow = false
         act(() => {
            result.current.debouncedFn()
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledTimes(2)
      })

      it('should not call onSuccess if callbackToBounce throws', () => {
         const errorCallback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onSuccess = vi.fn()
         const onError = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: errorCallback, onSuccess, onError }))

         act(() => {
            result.current.debouncedFn()
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onSuccess).not.toHaveBeenCalled()
         expect(onError).toHaveBeenCalled()
      })

      it('should call onFinally even if callbackToBounce throws', () => {
         const errorCallback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onError = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: errorCallback, onError, onFinally }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError).toHaveBeenCalledWith(expect.any(Error), 'test')
         expect(onFinally).toHaveBeenCalledWith('test')
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
               result.current.debouncedFn(`call-${index}`)
            })
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith('call-4')
      })

      it('should handle zero delay', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 0 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         act(() => {
            vi.advanceTimersByTime(0)
         })

         expect(callback).toHaveBeenCalledWith('test')
      })
   })

   describe('Performance and memory', () => {
      it('should not create new debounced function on every render', () => {
         const callback = vi.fn()
         const { result, rerender } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         const firstResult = result.current
         rerender()
         const secondResult = result.current

         expect(firstResult).toBe(secondResult)
         expect(firstResult.debouncedFn).toBe(secondResult.debouncedFn)
         expect(firstResult.cleanup).toBe(secondResult.cleanup)
      })

      it('should handle many rapid calls efficiently', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 100 }))

         act(() => {
            for (let i = 0; i < 1000; i++) {
               result.current.debouncedFn(i)
            }
         })

         act(() => {
            vi.advanceTimersByTime(100)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith(999)
      })

      it('should not cause memory leaks with immediateCallback on many calls', () => {
         const immediate = vi.fn()
         const callback = vi.fn()
         const { result } = renderHook(() =>
            useDebouncedFn({ immediateCallback: immediate, callbackToBounce: callback, delay: 100 })
         )

         act(() => {
            for (let i = 0; i < 100; i++) {
               result.current.debouncedFn(i)
            }
         })

         expect(immediate).toHaveBeenCalledTimes(100)

         act(() => {
            vi.advanceTimersByTime(100)
         })

         expect(callback).toHaveBeenCalledTimes(1)
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
            result.current.debouncedFn()
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
            result.current.debouncedFn()
         })

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

   describe('Type safety with function overloads', () => {
      it('should handle event objects with proper typing', () => {
         const callback = vi.fn()
         const immediate = vi.fn()

         const { result } = renderHook(() =>
            useDebouncedFn<React.ChangeEvent<HTMLInputElement>>({
               immediateCallback: immediate,
               callbackToBounce: callback,
            })
         )

         const mockEvent = {
            target: { value: 'test' },
         } as React.ChangeEvent<HTMLInputElement>

         act(() => {
            result.current.debouncedFn(mockEvent)
         })

         expect(immediate).toHaveBeenCalledWith(mockEvent)

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith(mockEvent)
      })

      it('should handle multiple arguments with proper typing', () => {
         const callback = vi.fn()

         const { result } = renderHook(() =>
            useDebouncedFn<string, [number, boolean]>({
               callbackToBounce: callback,
            })
         )

         act(() => {
            result.current.debouncedFn('test', 42, true)
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith('test', 42, true)
      })
   })
})
