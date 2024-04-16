import { act, renderHook } from '@testing-library/react'
import useLocalStorage from '.'

describe('use-local-storage', () => {
   afterEach(() => {
      localStorage.clear()
   })

   it('should return state and setState', () => {
      const { result } = renderHook(() => useLocalStorage('user'))

      expect(result.current[0]).toBe('')
      expect(typeof result.current[1]).toBe('function')
   })

   it('should set the default value', () => {
      const { result } = renderHook(() => useLocalStorage('user', { name: 'Saitama' }))

      expect(result.current[0]).toEqual({ name: 'Saitama' })
   })

   it('should update the state in local storage', () => {
      const { result, rerender } = renderHook(() => useLocalStorage('user', { name: 'Saitama' }))

      act(() => {
         result.current[1]({ name: 'Genos' })
      })
      rerender()
      expect(result.current[0]).toEqual({ name: 'Genos' })
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual({ name: 'Genos' })
   })

   it('should be able to handle function in setState', () => {
      const { result, rerender } = renderHook(() => useLocalStorage('user', { name: 'Saitama' }))

      act(() => {
         result.current[1]((old_value) => {
            old_value.name = 'Blast'
            return { ...old_value }
         })
      })
      rerender()
      expect(result.current[0]).toEqual({ name: 'Blast' })
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual({ name: 'Blast' })
   })
})
