import { vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDebouncedFn } from '.'
import { act } from 'react'

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

         result.current.debouncedFn()

         expect(callback).not.toHaveBeenCalled()
      })
   })

   describe('unmounting', () => {
      it('should cleanup timer on unmount', async () => {
         const callback = vi.fn()

         const { result, unmount } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 500 }))

         result.current.debouncedFn()

         unmount()

         await act(() => {
            vi.advanceTimersByTime(600)
         })

         expect(callback).not.toHaveBeenCalled()
      })

      it('should cleanup multiple pending timers on unmount', async () => {
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

         await act(() => {
            vi.advanceTimersByTime(500)
         })

         expect(callback).not.toHaveBeenCalled()
      })

      it('should not cause memory leaks with repeated mount/unmount', async () => {
         const callback = vi.fn()

         for (let i = 0; i < 10; i++) {
            const { result, unmount } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 100 }))

            result.current.debouncedFn()

            unmount()
         }

         await act(() => {
            vi.advanceTimersByTime(200)
         })

         expect(callback).not.toHaveBeenCalled()
      })

      it('should abort pending async operations on unmount', () => {
         const callback = vi.fn(async (signal: AbortSignal) => {
            return new Promise((resolve, reject) => {
               const timeout = setTimeout(() => resolve('completed'), 100)
               signal.addEventListener('abort', () => {
                  clearTimeout(timeout)
                  reject(new DOMException('Aborted', 'AbortError'))
               })
            })
         })
         const onError = vi.fn()

         const { result, unmount } = renderHook(() =>
            useDebouncedFn({ callbackToBounce: callback, onError, delay: 300 })
         )

         result.current.debouncedFn()

         act(() => {
            vi.advanceTimersByTime(300)
         })

         unmount()

         act(() => {
            vi.advanceTimersByTime(100)
         })

         // AbortError should be caught but not passed to onError
         expect(onError).not.toHaveBeenCalled()
      })
   })

   describe('Debouncing behavior', () => {
      it('should use default delay of 300ms', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         result.current.debouncedFn()

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

         result.current.debouncedFn()

         act(() => {
            vi.advanceTimersByTime(499)
         })
         expect(callback).not.toHaveBeenCalled()

         act(() => {
            vi.advanceTimersByTime(1) // Total 500ms
         })
         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should debounce multiple rapid calls', async () => {
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

         await act(() => {
            vi.advanceTimersByTime(199)
         })
         expect(callback).not.toHaveBeenCalled()

         await act(() => {
            vi.advanceTimersByTime(1) // 200ms from last call
         })
         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should allow multiple executions after delay periods', async () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 100 }))

         // First execution
         result.current.debouncedFn('first')
         await act(() => {
            vi.advanceTimersByTime(100)
         })
         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenNthCalledWith(1, expect.any(AbortSignal), 'first')

         // Second execution
         result.current.debouncedFn('second')
         await act(() => {
            vi.advanceTimersByTime(100)
         })
         expect(callback).toHaveBeenCalledTimes(2)
         expect(callback).toHaveBeenNthCalledWith(2, expect.any(AbortSignal), 'second')
      })
   })

   describe('AbortSignal behavior', () => {
      it('should pass AbortSignal as first argument to callbackToBounce', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         result.current.debouncedFn('arg1', 'arg2', 123)
         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledTimes(1)
         const callArgs = callback.mock.calls[0]!
         expect(callArgs[0]).toBeInstanceOf(AbortSignal)
         expect(callArgs[1]).toBe('arg1')
         expect(callArgs[2]).toBe('arg2')
         expect(callArgs[3]).toBe(123)
      })

      it('should abort previous operation when new call is made', async () => {
         let abortedCount = 0
         const callback = vi.fn(async (signal: AbortSignal, value: string) => {
            return new Promise((resolve, reject) => {
               const timeout = setTimeout(() => resolve(value), 100)
               signal.addEventListener('abort', () => {
                  abortedCount++
                  clearTimeout(timeout)
                  reject(new DOMException('Aborted', 'AbortError'))
               })
            })
         })

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 200 }))

         result.current.debouncedFn('first')

         await act(() => {
            vi.advanceTimersByTime(200)
         })

         result.current.debouncedFn('second') // Should abort first

         expect(abortedCount).toBe(1)
      })

      it('should not call onError when AbortError is thrown', async () => {
         const callback = vi.fn(async (signal: AbortSignal) => {
            return new Promise((resolve, reject) => {
               const timeout = setTimeout(() => resolve('completed'), 100)
               signal.addEventListener('abort', () => {
                  clearTimeout(timeout)
                  reject(new DOMException('Aborted', 'AbortError'))
               })
            })
         })
         const onError = vi.fn()

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError, delay: 300 }))

         result.current.debouncedFn()

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         // Trigger abort by calling again
         result.current.debouncedFn()

         // AbortError should be caught internally and not trigger onError
         expect(onError).not.toHaveBeenCalled()
      })

      it('should call onError for non-abort errors', async () => {
         const testError = new Error('Regular error')
         const callback = vi.fn(async (signal: AbortSignal) => {
            throw testError
         })
         const onError = vi.fn()

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError, delay: 300 }))

         result.current.debouncedFn('test')

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError).toHaveBeenCalledWith(testError, 'test')
      })

      it('should provide non-aborted signal on first execution', async () => {
         const callback = vi.fn((signal: AbortSignal) => {
            expect(signal.aborted).toBe(false)
         })

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         result.current.debouncedFn()

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should handle fetch requests with abort signal', async () => {
         const mockFetch = vi.fn((url: string, options: any) => {
            return new Promise((resolve, reject) => {
               const timeout = setTimeout(
                  () => resolve({ ok: true, json: () => Promise.resolve({ data: 'test' }) }),
                  100
               )
               options.signal.addEventListener('abort', () => {
                  clearTimeout(timeout)
                  reject(new DOMException('Aborted', 'AbortError'))
               })
            })
         })

         global.fetch = mockFetch as any

         const callback = vi.fn(async (signal: AbortSignal, query: string) => {
            const response = await fetch(`/api/search?q=${query}`, { signal })
            return response
         })

         const onError = vi.fn()

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError, delay: 300 }))

         act(() => {
            result.current.debouncedFn('first')
         })

         act(() => {
            vi.advanceTimersByTime(300)
         })

         // Cancel with new call before fetch completes
         act(() => {
            result.current.debouncedFn('second')
         })

         await act(() => {
            vi.advanceTimersByTime(200)
         })

         // First fetch should be aborted, onError should not be called for AbortError
         expect(onError).not.toHaveBeenCalled()
      })
   })

   describe('Argument passing to callback', () => {
      it('should pass arguments correctly to the callback', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         result.current.debouncedFn('arg1', 'arg2', 123)
         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'arg1', 'arg2', 123)
      })

      it('should use arguments from the latest call', async () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 200 }))

         act(() => {
            result.current.debouncedFn('first')
            result.current.debouncedFn('second')
            result.current.debouncedFn('third') // This should be the final call
         })

         await act(() => {
            vi.advanceTimersByTime(200)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'third')
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

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), originalObj)
         expect(callback.mock.calls?.[0]?.[1].value).toBe('modified')
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
         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'third')
      })

      it('should pass all arguments to immediateCallback', () => {
         const immediate = vi.fn()
         const callback = vi.fn()
         const { result } = renderHook(() =>
            useDebouncedFn({ immediateCallback: immediate, callbackToBounce: callback })
         )

         result.current.debouncedFn('arg1', 42, { key: 'value' })

         expect(immediate).toHaveBeenCalledWith('arg1', 42, { key: 'value' })
      })

      it('should work without immediateCallback', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         result.current.debouncedFn('test')
         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test')
      })
   })

   describe('onSuccess', () => {
      it('should call onSuccess after sync callbackToBounce completes', async () => {
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess, delay: 300 }))

         result.current.debouncedFn('test')

         // Wait for the scheduled callbacks to get resolved
         // then check the status
         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test')
         expect(onSuccess).toHaveBeenCalledWith('test')
         expect(callback).toHaveBeenCalledBefore(onSuccess)
      })

      it('should call onSuccess after async callbackToBounce completes', async () => {
         const callback = vi.fn(async (signal: AbortSignal, val: string) => {
            await new Promise((resolve) => setTimeout(resolve, 100))
            return val
         })
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess, delay: 300 }))

         result.current.debouncedFn('async-test')
         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'async-test')

         await act(() => {
            vi.advanceTimersByTime(100)
         })

         expect(onSuccess).toHaveBeenCalledWith('async-test')
      })

      it('should pass same arguments to onSuccess', async () => {
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess }))

         result.current.debouncedFn('arg1', 123, { nested: true })

         await act(() => {
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

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test')
      })

      it('should not call onSuccess if execution is cancelled', async () => {
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess, delay: 300 }))

         result.current.debouncedFn('first')

         await act(() => {
            vi.advanceTimersByTime(100)
            result.current.debouncedFn('second') // Cancels first
         })

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'second')
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

         result.current.debouncedFn('test')
         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test')
         expect(onError).toHaveBeenCalledWith(error, 'test')
      })

      it('should pass all arguments to onError', () => {
         const error = new Error('Test error')
         const callback = vi.fn(() => {
            throw error
         })
         const onError = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError }))

         result.current.debouncedFn('arg1', 42, { key: 'value' })
         vi.advanceTimersByTime(300)

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

         result.current.debouncedFn('test')
         vi.advanceTimersByTime(300)

         expect(onError).toHaveBeenCalled()
         expect(onSuccess).not.toHaveBeenCalled()
      })

      it('should work without onError (error is not caught)', async () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         result.current.debouncedFn('test')
         // Error is thrown but not caught
         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test')
      })

      it('should not call onError if execution is cancelled', async () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onError = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError, delay: 300 }))

         result.current.debouncedFn('first')

         await act(() => {
            vi.advanceTimersByTime(100)
            result.current.debouncedFn('second') // Cancels first
         })

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError).toHaveBeenCalledTimes(1)
         expect(onError).toHaveBeenCalledWith(expect.any(Error), 'second')
      })
   })

   describe('onFinally', () => {
      it('should call onFinally after successful execution', async () => {
         const callback = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally, delay: 300 }))

         result.current.debouncedFn('test')

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test')
         expect(onFinally).toHaveBeenCalledWith('test')
      })

      it('should call onFinally after error', () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally, delay: 300 }))

         result.current.debouncedFn('test')
         vi.advanceTimersByTime(300)

         expect(onFinally).toHaveBeenCalledWith('test')
      })

      it('should call onFinally with all arguments', async () => {
         const callback = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally }))

         result.current.debouncedFn('arg1', 42, { key: 'value' })

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onFinally).toHaveBeenCalledWith('arg1', 42, { key: 'value' })
      })

      it('should work without onFinally', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback }))

         result.current.debouncedFn('test')
         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test')
      })

      it('should not call onFinally if execution is cancelled', async () => {
         const callback = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally, delay: 300 }))

         result.current.debouncedFn('first')

         await act(() => {
            vi.advanceTimersByTime(100)
            result.current.debouncedFn('second') // Cancels first
         })

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onFinally).toHaveBeenCalledTimes(1)
         expect(onFinally).toHaveBeenCalledWith('second')
      })
   })

   describe('All callbacks together', () => {
      it('should execute callbacks in correct order: immediate -> debounced -> success -> finally', async () => {
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

         result.current.debouncedFn('test')

         expect(executionOrder).toEqual(['immediate'])

         await act(() => {
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

         result.current.debouncedFn('test')
         expect(executionOrder).toEqual(['immediate'])
         vi.advanceTimersByTime(300)

         expect(executionOrder).toEqual(['immediate', 'debounced', 'error', 'finally'])
      })

      it('should pass same arguments to all callbacks (except AbortSignal to debounced)', async () => {
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

         result.current.debouncedFn(testObj, 'extra', 42)

         expect(immediate).toHaveBeenCalledWith(testObj, 'extra', 42)

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), testObj, 'extra', 42)
         expect(onSuccess).toHaveBeenCalledWith(testObj, 'extra', 42)
         expect(onFinally).toHaveBeenCalledWith(testObj, 'extra', 42)
      })

      it('should pass same arguments to error and finally callbacks', async () => {
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

         await vi.advanceTimersByTime(300)

         expect(onError).toHaveBeenCalledWith(expect.any(Error), testObj, 'extra', 42)
         expect(onFinally).toHaveBeenCalledWith(testObj, 'extra', 42)
      })
   })

   describe('Manual cleanup', () => {
      it('should cancel pending execution when cleanup is called', async () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         result.current.debouncedFn('test')
         await vi.advanceTimersByTime(100)
         result.current.cleanup()

         await vi.advanceTimersByTime(300)

         expect(callback).not.toHaveBeenCalled()
      })

      it('should not call onSuccess when cleanup cancels execution', async () => {
         const callback = vi.fn()
         const onSuccess = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onSuccess, delay: 300 }))

         result.current.debouncedFn('test')
         result.current.cleanup()
         await vi.advanceTimersByTime(300)

         expect(callback).not.toHaveBeenCalled()
         expect(onSuccess).not.toHaveBeenCalled()
      })

      it('should not call onFinally when cleanup cancels execution', async () => {
         const callback = vi.fn()
         const onFinally = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onFinally, delay: 300 }))

         result.current.debouncedFn('test')
         result.current.cleanup()
         await vi.advanceTimersByTime(300)

         expect(callback).not.toHaveBeenCalled()
         expect(onFinally).not.toHaveBeenCalled()
      })

      it('should allow new calls after cleanup', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 300 }))

         result.current.debouncedFn('first')
         result.current.cleanup()

         result.current.debouncedFn('second')

         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'second')
      })

      it('should abort async operations when cleanup is called', async () => {
         let wasAborted = false
         const callback = vi.fn(async (signal: AbortSignal) => {
            return new Promise((resolve, reject) => {
               const timeout = setTimeout(() => resolve('completed'), 100)
               signal.addEventListener('abort', () => {
                  wasAborted = true
                  clearTimeout(timeout)
                  reject(new DOMException('Aborted', 'AbortError'))
               })
            })
         })
         const onError = vi.fn()

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, onError, delay: 300 }))

         result.current.debouncedFn()
         vi.advanceTimersByTime(300)

         act(() => {
            result.current.cleanup()
         })

         expect(wasAborted).toBe(true)
         // AbortError should not trigger onError
         expect(onError).not.toHaveBeenCalled()
      })
   })

   describe('Context binding', () => {
      it('should not preserve this context (calls with null)', async () => {
         let capturedThis: any = 'not-set'
         const testObj = {
            name: 'test',
            callback: function () {
               capturedThis = this
            },
         }

         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: testObj.callback }))

         result.current.debouncedFn.call(testObj) // Try to set context

         await act(() => {
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

         result.current.debouncedFn()

         rerender({ callback: callback2 })

         vi.advanceTimersByTime(300)

         expect(callback1).not.toHaveBeenCalled()
         expect(callback2).toHaveBeenCalledTimes(1)
      })

      it('should update delay and cleanup previous timer', () => {
         const callback = vi.fn()

         const { result, rerender } = renderHook(({ delay }) => useDebouncedFn({ callbackToBounce: callback, delay }), {
            initialProps: { delay: 200 },
         })

         result.current.debouncedFn()

         rerender({ delay: 500 })

         vi.advanceTimersByTime(200)
         expect(callback).not.toHaveBeenCalled()

         result.current.debouncedFn()
         vi.advanceTimersByTime(500)

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

         result.current.debouncedFn('test1')

         expect(immediate1).toHaveBeenCalledWith('test1')

         rerender({ immediate: immediate2 })

         act(() => {
            result.current.debouncedFn('test2')
         })

         expect(immediate2).toHaveBeenCalledWith('test2')
         expect(immediate1).toHaveBeenCalledTimes(1)
      })

      it('should update onSuccess when it changes', async () => {
         const callback = vi.fn()
         const onSuccess1 = vi.fn()
         const onSuccess2 = vi.fn()

         const { result, rerender } = renderHook(
            ({ onSuccess }) => useDebouncedFn({ callbackToBounce: callback, onSuccess }),
            { initialProps: { onSuccess: onSuccess1 } }
         )

         result.current.debouncedFn('test1')

         rerender({ onSuccess: onSuccess2 })

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onSuccess1).not.toHaveBeenCalled()
         expect(onSuccess2).toHaveBeenCalledWith('test1')
      })

      it('should update onError when it changes', async () => {
         const callback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onError1 = vi.fn()
         const onError2 = vi.fn()

         const { result, rerender } = renderHook(
            ({ onError }) => useDebouncedFn({ callbackToBounce: callback, onError }),
            { initialProps: { onError: onError1 } }
         )

         result.current.debouncedFn('test1')

         rerender({ onError: onError2 })

         await act(() => {
            vi.advanceTimersByTime(300)
         })

         expect(onError1).not.toHaveBeenCalled()
         expect(onError2).toHaveBeenCalledWith(expect.any(Error), 'test1')
      })

      it('should update onFinally when it changes', async () => {
         const callback = vi.fn()
         const onFinally1 = vi.fn()
         const onFinally2 = vi.fn()

         const { result, rerender } = renderHook(
            ({ onFinally }) => useDebouncedFn({ callbackToBounce: callback, onFinally }),
            { initialProps: { onFinally: onFinally1 } }
         )

         result.current.debouncedFn('test1')

         rerender({ onFinally: onFinally2 })

         await act(() => {
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

         result.current.debouncedFn()

         // Update both message and callback
         message = 'updated'
         callback = createCallback()
         rerender()

         vi.advanceTimersByTime(300)

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

         result.current.debouncedFn()
         vi.advanceTimersByTime(300)

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
         result.current.debouncedFn()

         vi.advanceTimersByTime(300)

         expect(onError).toHaveBeenCalled()

         // Second call succeeds
         shouldThrow = false
         result.current.debouncedFn()

         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledTimes(2)
      })

      it('should not call onSuccess if callbackToBounce throws', () => {
         const errorCallback = vi.fn(() => {
            throw new Error('Test error')
         })
         const onSuccess = vi.fn()
         const onError = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: errorCallback, onSuccess, onError }))

         result.current.debouncedFn()
         vi.advanceTimersByTime(300)

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

         result.current.debouncedFn('test')

         vi.advanceTimersByTime(300)

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

         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'call-4')
      })

      it('should handle zero delay', () => {
         const callback = vi.fn()
         const { result } = renderHook(() => useDebouncedFn({ callbackToBounce: callback, delay: 0 }))

         act(() => {
            result.current.debouncedFn('test')
         })

         vi.advanceTimersByTime(0)

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test')
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

         vi.advanceTimersByTime(100)

         expect(callback).toHaveBeenCalledTimes(1)
         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 999)
      })

      it('should not cause memory leaks with immediateCallback on many calls', () => {
         const immediate = vi.fn()
         const callback = vi.fn()
         const { result } = renderHook(() =>
            useDebouncedFn({ immediateCallback: immediate, callbackToBounce: callback, delay: 100 })
         )

         for (let i = 0; i < 100; i++) {
            result.current.debouncedFn(i)
         }

         expect(immediate).toHaveBeenCalledTimes(100)

         vi.advanceTimersByTime(100)

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

         result.current.debouncedFn()
         vi.advanceTimersByTime(200)

         expect(callback).toHaveBeenCalledTimes(1)
      })

      it('should handle component re-renders during debounce period', () => {
         const callback = vi.fn()
         let renderCount = 0

         const { result, rerender } = renderHook(() => {
            renderCount++
            return useDebouncedFn({ callbackToBounce: callback, delay: 300 })
         })

         result.current.debouncedFn()

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

         result.current.debouncedFn(mockEvent)

         expect(immediate).toHaveBeenCalledWith(mockEvent)

         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), mockEvent)
      })

      it('should handle multiple arguments with proper typing', () => {
         const callback = vi.fn()

         const { result } = renderHook(() =>
            useDebouncedFn<string, [number, boolean]>({
               callbackToBounce: callback,
            })
         )

         result.current.debouncedFn('test', 42, true)
         vi.advanceTimersByTime(300)

         expect(callback).toHaveBeenCalledWith(expect.any(AbortSignal), 'test', 42, true)
      })
   })
})
