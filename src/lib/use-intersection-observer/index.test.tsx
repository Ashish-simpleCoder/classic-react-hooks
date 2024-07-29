import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useInterSectionObserver from '.'

describe('use-intersection-observer', () => {
   const InitialObserver = global.IntersectionObserver

   let IntersectionObserverSpy = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      takeRecords: () => [],
      root: document,
      rootMargin: '0px',
      thresholds: [0],
   }))

   beforeAll(() => {
      global.IntersectionObserver = IntersectionObserverSpy
   })

   afterAll(() => {
      global.IntersectionObserver = InitialObserver
   })

   it('should run without error', () => {
      const div = document.createElement('div')

      renderHook(() => useInterSectionObserver([div]))
   })

   it('should call disconnect on un-mount', () => {
      const div = document.createElement('div')

      const { unmount } = renderHook(() => useInterSectionObserver([div]))

      expect(IntersectionObserverSpy.mock.results[0]?.value.disconnect).toHaveBeenCalledTimes(0)
      unmount()
      expect(IntersectionObserverSpy.mock.results[0]?.value.disconnect).toHaveBeenCalledTimes(1)
   })
})
