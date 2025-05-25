import { renderHook } from '@testing-library/react'
import useLocalStorage from '.'
import { act } from 'react'

describe('use-local-storage', () => {
   afterEach(() => {
      localStorage.clear()
   })

   it('should return state and setState', () => {
      const { result } = renderHook(() => useLocalStorage({ key: 'user' }))

      expect(result.current[0]).toBe('')
      expect(typeof result.current[1]).toBe('function')
   })

   it('should be able handle error when item is undefined in local-storage', () => {
      localStorage.setItem('key', '') // when getting localStorage.getItem(key) => '', it results into undefined
      const { result } = renderHook(() => useLocalStorage({ key: 'key' }))
      expect(result.current[0]).toBeUndefined()
   })

   it('should be able handle error when with default value param', () => {
      localStorage.setItem('key', '')
      const { result } = renderHook(() => useLocalStorage({ key: 'key', defaultValue: {} }))
      expect(result.current[0]).toStrictEqual({})
   })

   it('should set the default value', () => {
      const { result } = renderHook(() => useLocalStorage({ key: 'user', defaultValue: { name: 'Saitama' } }))

      expect(result.current[0]).toEqual({ name: 'Saitama' })
   })

   it('should update the state in local storage', () => {
      const { result, rerender } = renderHook(() => useLocalStorage({ key: 'user', defaultValue: { name: 'Saitama' } }))

      act(() => {
         result.current[1]({ name: 'Genos' })
      })
      rerender()
      expect(result.current[0]).toEqual({ name: 'Genos' })
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual({ name: 'Genos' })
   })

   it('should be able to handle function in setState', () => {
      const { result, rerender } = renderHook(() => useLocalStorage({ key: 'user', defaultValue: { name: 'Saitama' } }))

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
