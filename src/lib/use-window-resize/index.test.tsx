import { act, render, renderHook, screen } from '@testing-library/react'
import { vi } from 'vitest'
import useWindowResize from '.'

describe('use-window-resize', () => {
   describe('mounting', () => {
      it('should render without errors', () => {
         renderHook(() => useWindowResize({ handler: () => window.innerWidth < 400 }))
      })
   })
   describe('unmounting', () => {
      it('should remove event on unmount', () => {
         vi.spyOn(window, 'removeEventListener')

         const { unmount } = renderHook(() => useWindowResize({ handler: () => window.innerWidth < 400 }))
         expect(window.removeEventListener).not.toHaveBeenCalled()
         unmount()
         expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function), expect.any(Object))
      })

      it('should remove resize event when shouldInjectEvent becomes false', () => {
         let shouldInjectEvent = true
         const fn = vi.fn()
         vi.spyOn(window, 'removeEventListener')

         const { rerender } = renderHook(() => useWindowResize({ handler: fn, options: { shouldInjectEvent } }))
         expect(fn).toHaveBeenCalledTimes(1)

         act(() => {
            window.dispatchEvent(new Event('resize'))
         })
         expect(fn).toHaveBeenCalledTimes(2)
         expect(fn).toHaveBeenCalledTimes(2)
         expect(window.removeEventListener).not.toHaveBeenCalled()

         shouldInjectEvent = false
         rerender()
         expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function), expect.any(Object))

         act(() => {
            window.dispatchEvent(new Event('resize'))
         })
         expect(fn).toHaveBeenCalledTimes(2)
      })
   })

   describe('defaultValue behavior', () => {
      it('should return defaultValue as result if defaultValue is passed', () => {
         const { result } = renderHook(() => useWindowResize({ handler: vi.fn(), options: { defaultValue: true } }))
         expect(result.current).toBe(true)
      })
   })

   describe('resize event trigger', () => {
      it('should update the result when window is resized', () => {
         const { result } = renderHook(() =>
            useWindowResize({
               handler: () => {
                  return window.innerWidth < 400
               },
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

      it('should dynamically add and remove event listener based on shouldInjectEvent', () => {
         let shouldInjectEvent = true
         const handler = vi.fn(() => window.innerWidth < 400)

         // Initial render with shouldInjectEvent: true
         const { rerender } = renderHook(() =>
            useWindowResize({
               handler,
               options: { shouldInjectEvent },
            })
         )
         expect(handler).toHaveBeenCalledTimes(1) // Called once on initial render

         // Trigger resize, handler should be called
         act(() => {
            window.innerWidth = 300
            window.dispatchEvent(new Event('resize'))
         })
         expect(handler).toHaveBeenCalledTimes(2)

         // Change shouldInjectEvent to false and rerender
         shouldInjectEvent = false
         rerender()
         expect(handler).toHaveBeenCalledTimes(2) // Handler not called on rerender with shouldInjectEvent: false

         // Trigger resize, handler should NOT be called
         act(() => {
            window.innerWidth = 200
            window.dispatchEvent(new Event('resize'))
         })
         expect(handler).toHaveBeenCalledTimes(2) // Still 2, event listener removed

         // Change shouldInjectEvent back to true and rerender
         shouldInjectEvent = true
         rerender()
         act(() => {
            window.dispatchEvent(new Event('resize'))
            expect(handler).toHaveBeenCalledTimes(3) // Handler called again because event listener re-added
         })

         // Trigger resize, handler should be called again
         act(() => {
            window.innerWidth = 100
            window.dispatchEvent(new Event('resize'))
         })
         expect(handler).toHaveBeenCalledTimes(4)
      })
   })

   describe('integration with React component', () => {
      it('should update component based on window resize', () => {
         // Initial width: Desktop View
         window.innerWidth = 1024
         render(<TestComponent />)
         expect(screen.getByText('Desktop View')).toBeInTheDocument()
         expect(screen.queryByText('Mobile View')).not.toBeInTheDocument()

         // Resize to mobile width
         act(() => {
            window.innerWidth = 500
            window.dispatchEvent(new Event('resize'))
         })
         expect(screen.getByText('Mobile View')).toBeInTheDocument()
         expect(screen.queryByText('Desktop View')).not.toBeInTheDocument()

         // Resize back to desktop width
         act(() => {
            window.innerWidth = 800
            window.dispatchEvent(new Event('resize'))
         })
         expect(screen.getByText('Desktop View')).toBeInTheDocument()
         expect(screen.queryByText('Mobile View')).not.toBeInTheDocument()
      })
   })
})

function TestComponent() {
   const isMobile = useWindowResize({ handler: () => window.innerWidth < 768 })

   return <div>{isMobile ? 'Mobile View' : 'Desktop View'}</div>
}
