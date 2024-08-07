import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useWindowResize from '.'
import { act } from 'react-dom/test-utils'

describe('use-window-resize', () => {
   it('should run without errors', () => {
      renderHook(() => useWindowResize(() => window.innerWidth < 400))
   })

   it('should return defaultValue, if defaultValue is passed', () => {
      const { result } = renderHook(() => useWindowResize(() => window.innerWidth < 400, { defaultValue: true }))
      expect(result.current).toBe(true)
   })

   it('should update the result when window is resized', () => {
      const { result } = renderHook(() =>
         useWindowResize(() => {
            return window.innerWidth < 400
         })
      )
      expect(result.current).toBe(false)

      act(() => {
         window.innerWidth = 200
         window.dispatchEvent(new Event('resize'))
      })
      expect(result.current).toBe(true)

      act(() => {
         window.innerWidth = 600
         window.dispatchEvent(new Event('resize'))
      })
      expect(result.current).toBe(false)
   })

   it('should remove resize event when shouldInjectEvent becomes false', () => {
      let shouldInjectEvent = true
      const cb = vi.fn()

      const { rerender } = renderHook(() => useWindowResize(cb, { shouldInjectEvent }))
      expect(cb).toHaveBeenCalledTimes(1)
      act(() => {
         window.dispatchEvent(new Event('resize'))
      })
      expect(cb).toHaveBeenCalledTimes(2)
      expect(cb).toHaveBeenCalledTimes(2)

      shouldInjectEvent = false
      rerender()
      act(() => {
         window.dispatchEvent(new Event('resize'))
      })
      expect(cb).toHaveBeenCalledTimes(2)
   })
})
