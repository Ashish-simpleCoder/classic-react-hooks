import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import useMultipleIntersectionObserver from '.'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
const mockObserve = vi.fn()
const mockUnobserve = vi.fn()
const mockDisconnect = vi.fn()

beforeEach(() => {
   mockIntersectionObserver.mockImplementation((callback) => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
      // Store callback for manual triggering
      _callback: callback,
   }))

   // Mock window.IntersectionObserver
   Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: mockIntersectionObserver,
   })
})

afterEach(() => {
   vi.clearAllMocks()
})

// Helper function to trigger intersection
const forcefullyTriggerIntersection = (entry?: Partial<IntersectionObserverEntry>, mockIndex = 0) => {
   const mockInstance = mockIntersectionObserver.mock.results[mockIndex]?.value
   mockInstance._callback([
      {
         isIntersecting: !!entry?.isIntersecting,
         target: entry?.target || document.createElement('div'),
      },
   ])
}

describe('useMultipleIntersectionObserver', () => {
   it('creates observers for multiple keys', () => {
      const { result } = renderHook(() => useMultipleIntersectionObserver(['header', 'footer', 'sidebar']))

      expect(result.current.header).toHaveProperty('setHeaderElementRef')
      expect(result.current.header).toHaveProperty('isHeaderElementIntersecting')
      expect(result.current.header).toHaveProperty('headerElement')

      expect(result.current.footer).toHaveProperty('setFooterElementRef')
      expect(result.current.sidebar).toHaveProperty('setSidebarElementRef')
   })

   it('passes options to all observers', () => {
      const onIntersection = vi.fn()
      const { result } = renderHook(() =>
         useMultipleIntersectionObserver(['a', 'b'], {
            threshold: 0.8,
            onIntersection,
            onlyTriggerOnce: true,
         })
      )

      const elA = document.createElement('div')
      const elB = document.createElement('div')

      act(() => {
         result.current.a.setAElementRef(elA)
         result.current.b.setBElementRef(elB)
      })

      expect(mockIntersectionObserver).toHaveBeenCalledWith(
         expect.any(Function),
         expect.objectContaining({ threshold: 0.8 })
      )

      act(() => forcefullyTriggerIntersection({ isIntersecting: true, target: elA }))
      expect(onIntersection).toHaveBeenCalledWith({ target: elA, isIntersecting: true })
      expect(mockUnobserve).toHaveBeenCalledWith(elA) // onlyTriggerOnce
   })

   it('handles independent intersection states', () => {
      const { result } = renderHook(() => useMultipleIntersectionObserver(['left', 'right']))

      const leftEl = document.createElement('div')
      const rightEl = document.createElement('div')

      act(() => {
         result.current.left.setLeftElementRef(leftEl)
         result.current.right.setRightElementRef(rightEl)
      })

      // Trigger only left intersection
      act(() => forcefullyTriggerIntersection({ isIntersecting: true, target: leftEl }))

      expect(result.current.left.isLeftElementIntersecting).toBe(true)
      expect(result.current.right.isRightElementIntersecting).toBe(false)

      // Trigger right intersection
      act(() => forcefullyTriggerIntersection({ isIntersecting: true, target: rightEl }, 1))
      expect(result.current.left.isLeftElementIntersecting).toBe(true)
      expect(result.current.right.isRightElementIntersecting).toBe(true)

      //  Again update the status
      act(() => forcefullyTriggerIntersection({ isIntersecting: false, target: leftEl }))
      expect(result.current.left.isLeftElementIntersecting).toBe(false)
      expect(result.current.right.isRightElementIntersecting).toBe(true)

      act(() => forcefullyTriggerIntersection({ isIntersecting: false, target: rightEl }, 1))
      expect(result.current.left.isLeftElementIntersecting).toBe(false)
      expect(result.current.right.isRightElementIntersecting).toBe(false)
   })

   it('works with empty keys array', () => {
      const { result } = renderHook(() => useMultipleIntersectionObserver([]))
      expect(result.current).toEqual({})
   })

   it('maintains type safety for returned observers', () => {
      const { result } = renderHook(() => useMultipleIntersectionObserver(['nav', 'main'] as const))

      // These should be accessible without TypeScript errors
      result.current.nav.navElement
      result.current.nav.setNavElementRef
      result.current.nav.isNavElementIntersecting

      result.current.main.mainElement
      result.current.main.setMainElementRef
      result.current.main.isMainElementIntersecting
   })
})
