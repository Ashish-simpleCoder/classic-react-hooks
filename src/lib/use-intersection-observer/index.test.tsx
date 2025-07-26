import { act, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import useIntersectionObserver from '.'

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

describe('useIntersectionObserver', () => {
   describe('basic functionality', () => {
      it('should return correct default property names when no key is provided', () => {
         const { result } = renderHook(() => useIntersectionObserver())

         expect(result.current).toHaveProperty('setElementRef')
         expect(result.current).toHaveProperty('isElementIntersecting')
         expect(result.current).toHaveProperty('element')
         expect(typeof result.current.setElementRef).toBe('function')
         expect(typeof result.current.isElementIntersecting).toBe('boolean')
         expect(result.current.element).toBeNull()
      })

      it('should return correct property names when key is provided', () => {
         const { result } = renderHook(() => useIntersectionObserver({ key: 'hero' }))

         expect(result.current).toHaveProperty('setHeroElementRef')
         expect(result.current).toHaveProperty('isHeroElementIntersecting')
         expect(result.current).toHaveProperty('heroElement')
         expect(typeof result.current.setHeroElementRef).toBe('function')
         expect(typeof result.current.isHeroElementIntersecting).toBe('boolean')
         expect(result.current.heroElement).toBeNull()
      })

      it('should initialize with default state', () => {
         const { result } = renderHook(() => useIntersectionObserver())

         expect(result.current.element).toBeNull()
         expect(result.current.isElementIntersecting).toBe(false)
      })
   })

   describe('element reference management', () => {
      it('should update element when setElementRef is called', () => {
         const { result } = renderHook(() => useIntersectionObserver())
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         expect(result.current.element).toBe(mockElement)
      })

      it('should handle null element', () => {
         const { result } = renderHook(() => useIntersectionObserver())
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         expect(result.current.element).toBe(mockElement)

         act(() => {
            result.current.setElementRef(null)
         })

         expect(result.current.element).toBeNull()
      })
   })

   describe('IntersectionObserver integration', () => {
      it('should not create observer when element is null', () => {
         renderHook(() => useIntersectionObserver())

         expect(mockIntersectionObserver).not.toHaveBeenCalled()
      })

      it('should create observer when element is set', () => {
         const { result } = renderHook(() => useIntersectionObserver())
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
               root: undefined,
               rootMargin: undefined,
               threshold: undefined,
            })
         )
         expect(mockObserve).toHaveBeenCalledWith(mockElement)
      })

      it('should pass through IntersectionObserver options', () => {
         const { result } = renderHook(() =>
            useIntersectionObserver({
               root: document.body,
               rootMargin: '10px',
               threshold: 0.5,
            })
         )
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         expect(mockIntersectionObserver).toHaveBeenCalledWith(
            expect.any(Function),
            expect.objectContaining({
               root: document.body,
               rootMargin: '10px',
               threshold: 0.5,
            })
         )
      })

      it('should update intersection state when observer triggers', () => {
         const { result } = renderHook(() => useIntersectionObserver())
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         expect(result.current.isElementIntersecting).toBe(false)

         // forcefully updating the state
         act(() => {
            forcefullyTriggerIntersection({ isIntersecting: true })
         })

         expect(result.current.isElementIntersecting).toBe(true)

         act(() => {
            forcefullyTriggerIntersection({ isIntersecting: false })
         })

         expect(result.current.isElementIntersecting).toBe(false)
      })

      it('should disconnect observer on cleanup', () => {
         const { result, unmount } = renderHook(() => useIntersectionObserver())
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         unmount()

         expect(mockDisconnect).toHaveBeenCalled()
      })

      it('should reset intersection state on cleanup', () => {
         const { result, rerender } = renderHook(() => useIntersectionObserver())
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         act(() => {
            forcefullyTriggerIntersection({ isIntersecting: true })
         })

         expect(result.current.isElementIntersecting).toBe(true)

         // Trigger cleanup by changing element
         act(() => {
            result.current.setElementRef(null)
         })

         rerender()

         expect(result.current.isElementIntersecting).toBe(false)
      })
   })

   describe('onIntersection callback', () => {
      it('should call onIntersection callback when intersection occurs', () => {
         const onIntersection = vi.fn()
         const { result } = renderHook(() => useIntersectionObserver({ onIntersection }))
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         act(() => {
            forcefullyTriggerIntersection({ target: mockElement })
         })

         expect(onIntersection).toHaveBeenCalledWith({ target: mockElement, isIntersecting: false })
      })

      it('should handle callback updates', () => {
         const callback1 = vi.fn()
         const callback2 = vi.fn()

         const { result, rerender } = renderHook(
            ({ callback }) => useIntersectionObserver({ onIntersection: callback }),
            { initialProps: { callback: callback1 } }
         )

         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         // Update callback
         rerender({ callback: callback2 })

         act(() => {
            forcefullyTriggerIntersection({ isIntersecting: true, target: mockElement })
         })

         expect(callback1).not.toHaveBeenCalled()
         expect(callback2).toHaveBeenCalledWith({ target: mockElement, isIntersecting: true })
      })
   })

   describe('onlyTriggerOnce option', () => {
      it('should unobserve element when onlyTriggerOnce is true', () => {
         const { result } = renderHook(() => useIntersectionObserver({ onlyTriggerOnce: true }))
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         act(() => {
            forcefullyTriggerIntersection({ isIntersecting: true, target: mockElement })
         })

         expect(mockUnobserve).toHaveBeenCalledWith(mockElement)
      })

      it('should not unobserve when onlyTriggerOnce is false', () => {
         const { result } = renderHook(() => useIntersectionObserver({ onlyTriggerOnce: false }))
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         act(() => {
            forcefullyTriggerIntersection({ isIntersecting: true, target: mockElement })
         })

         expect(mockUnobserve).not.toHaveBeenCalled()
      })
   })

   //   gracefully handling un-availability of the API
   describe('IntersectionObserver availability', () => {
      it('should warn when IntersectionObserver is not available', () => {
         const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

         let copiedObserver = window.IntersectionObserver
         // @ts-expect-error Deleting the observer
         window.IntersectionObserver = undefined

         const { result } = renderHook(() => useIntersectionObserver())
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         expect(consoleSpy).toHaveBeenCalledWith('IntersectionObserver is not available.')

         consoleSpy.mockRestore()
         window.IntersectionObserver = copiedObserver
      })
      it('should not log out warning in Production environment', () => {
         const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

         process.env.NODE_ENV = 'production'

         let copiedObserver = window.IntersectionObserver
         // @ts-expect-error Deleting the observer
         window.IntersectionObserver = undefined

         const { result } = renderHook(() => useIntersectionObserver())
         const mockElement = document.createElement('div')

         act(() => {
            result.current.setElementRef(mockElement)
         })

         expect(consoleSpy).not.toHaveBeenCalledWith('IntersectionObserver is not available.')
         consoleSpy.mockRestore()
         window.IntersectionObserver = copiedObserver
      })
   })

   describe('TypeScript type safety', () => {
      it('should provide correct types for different key configurations', () => {
         // Test with no key
         const { result: result1 } = renderHook(() => useIntersectionObserver())

         // should be accessible without TypeScript errors
         result1.current.element
         result1.current.setElementRef
         result1.current.isElementIntersecting

         // Test with key
         const { result: result2 } = renderHook(() => useIntersectionObserver({ key: 'header' }))

         // should be accessible without TypeScript errors
         result2.current.headerElement
         result2.current.setHeaderElementRef
         result2.current.isHeaderElementIntersecting
      })
   })
})

// Integration test component
function TestComponent({ hookKey }: { hookKey?: string }) {
   const observer = hookKey ? useIntersectionObserver({ key: hookKey as any }) : useIntersectionObserver()

   return (
      <div>
         <div
            ref={
               hookKey
                  ? (observer as any)[`set${hookKey.charAt(0).toUpperCase()}${hookKey.slice(1)}ElementRef`]
                  : observer.setElementRef
            }
            data-testid='observed-element'
         >
            Observed Element
         </div>
         <div data-testid='intersection-status'>
            {hookKey
               ? String((observer as any)[`is${hookKey.charAt(0).toUpperCase()}${hookKey.slice(1)}ElementIntersecting`])
               : String(observer.isElementIntersecting)}
         </div>
      </div>
   )
}

describe('useIntersectionObserver integration tests', () => {
   it('should work in a real component without key', () => {
      render(<TestComponent />)

      expect(screen.getByTestId('observed-element')).toBeInTheDocument()
      expect(screen.getByTestId('intersection-status')).toHaveTextContent('false')

      act(() => {
         forcefullyTriggerIntersection({ isIntersecting: true })
      })

      expect(screen.getByTestId('intersection-status')).toHaveTextContent('true')
   })

   it('should work in a real component with key', () => {
      render(<TestComponent hookKey='hero' />)

      expect(screen.getByTestId('observed-element')).toBeInTheDocument()
      expect(screen.getByTestId('intersection-status')).toHaveTextContent('false')

      act(() => {
         forcefullyTriggerIntersection({ isIntersecting: true })
      })

      expect(screen.getByTestId('intersection-status')).toHaveTextContent('true')
   })
})
