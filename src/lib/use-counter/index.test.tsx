import { act, renderHook } from '@testing-library/react'
import useCounter from '.'

describe('use-counter', () => {
   it('should render', () => {
      renderHook(() => useCounter())
   })

   it('should return counter value of zero, incrementCounter and decrementCounter handlers with default key', () => {
      const { result } = renderHook(() => useCounter())

      expect('counter' in result.current).not.toBeUndefined()
      expect(result.current.counter).toBe(0)
      expect('incrementCounter' in result.current).not.toBeUndefined()
      expect('decrementCounter' in result.current).not.toBeUndefined()
   })

   it('should increment the counter with incrementCounter handler', () => {
      const { result } = renderHook(() => useCounter())

      act(() => {
         result.current.incrementCounter()
      })
      expect(result.current.counter).toBe(1)
   })

   it('should decrement the counter with decrementCounter handler', () => {
      const { result } = renderHook(() => useCounter())

      act(() => {
         result.current.decrementCounter()
      })
      expect(result.current.counter).toBe(-1)
   })

   it('should return dynamic keys with counter, incrementCounter and decrementCounter handlers according to passed key provided', () => {
      const { result } = renderHook(() => useCounter('base'))

      expect('baseCounter' in result.current).not.toBeUndefined()
      expect('incrementBaseCounter' in result.current).not.toBeUndefined()
      expect('decrementBaseCounter' in result.current).not.toBeUndefined()
   })
})
