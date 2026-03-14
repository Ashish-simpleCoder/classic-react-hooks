import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { expect, vi, describe, it, beforeEach, afterEach } from 'vitest'
import { useEventListener } from '.'
import { useState } from 'react'
import { EvTarget } from '../../types'

describe('useEventListener', () => {
   let targetElement: HTMLDivElement

   beforeEach(() => {
      targetElement = document.createElement('div')
      document.body.appendChild(targetElement)
   })

   afterEach(() => {
      document.body.removeChild(targetElement)
      vi.restoreAllMocks()
   })

   describe('Core Functionality', () => {
      it('should attach event listener on mount and detach on unmount', () => {
         const handler = vi.fn()
         const addSpy = vi.spyOn(targetElement, 'addEventListener')
         const removeSpy = vi.spyOn(targetElement, 'removeEventListener')

         const { unmount } = renderHook(() =>
            useEventListener({
               target: () => targetElement,
               event: 'click',
               handler,
            })
         )

         expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined)

         unmount()
         expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined)
      })

      it('should trigger the handler when the event occurs', () => {
         const handler = vi.fn()
         renderHook(() =>
            useEventListener({
               target: () => targetElement,
               event: 'click',
               handler,
            })
         )

         fireEvent.click(targetElement)
         expect(handler).toHaveBeenCalledTimes(1)
         expect(handler).toBeCalledWith(expect.any(Event))
      })

      it('should update the handler without re-attaching the listener', () => {
         const handler1 = vi.fn()
         const handler2 = vi.fn()
         const addSpy = vi.spyOn(targetElement, 'addEventListener')
         const removeSpy = vi.spyOn(targetElement, 'removeEventListener')

         const { rerender } = renderHook(
            ({ handler }) =>
               useEventListener({
                  target: () => targetElement,
                  event: 'click',
                  handler,
               }),
            { initialProps: { handler: handler1 } }
         )

         expect(addSpy).toHaveBeenCalledTimes(1)

         // Change handler
         rerender({ handler: handler2 })
         expect(addSpy).toHaveBeenCalledTimes(1) // Should not re-attach
         expect(removeSpy).not.toHaveBeenCalled()

         fireEvent.click(targetElement)
         expect(handler1).not.toHaveBeenCalled()
         expect(handler2).toHaveBeenCalledTimes(1)
      })

      it('should re-attach when the event type changes', () => {
         const handler = vi.fn()
         const addSpy = vi.spyOn(targetElement, 'addEventListener')
         const removeSpy = vi.spyOn(targetElement, 'removeEventListener')

         const { rerender } = renderHook(
            ({ event }) =>
               useEventListener({
                  target: () => targetElement,
                  event: event as any,
                  handler,
               }),
            { initialProps: { event: 'click' } }
         )

         expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined)
         expect(addSpy).toHaveBeenCalledTimes(1)

         rerender({ event: 'mousedown' })
         expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined)
         expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), undefined)
         expect(addSpy).toHaveBeenCalledTimes(2)
         expect(removeSpy).toHaveBeenCalledTimes(1)
      })
   })

   describe('Targeting', () => {
      it('should support window and document as targets', () => {
         const windowSpy = vi.spyOn(window, 'addEventListener')
         const documentSpy = vi.spyOn(document, 'addEventListener')

         renderHook(() => useEventListener({ target: () => window, event: 'resize', handler: vi.fn() }))
         expect(windowSpy).toHaveBeenCalledWith('resize', expect.any(Function), undefined)

         renderHook(() => useEventListener({ target: () => document, event: 'keydown', handler: vi.fn() }))
         expect(documentSpy).toHaveBeenCalledWith('keydown', expect.any(Function), undefined)
      })

      it('should re-attach when the target changes', () => {
         const div1 = targetElement
         const div2 = document.createElement('div')
         const handler = vi.fn()

         const { rerender } = renderHook(
            ({ target }) =>
               useEventListener({
                  target,
                  event: 'click',
                  handler,
               }),
            { initialProps: { target: (() => div1) as EvTarget } }
         )

         fireEvent.click(div1)
         expect(handler).toHaveBeenCalledTimes(1)

         rerender({ target: (() => div2) as EvTarget })
         fireEvent.click(div1)
         expect(handler).toHaveBeenCalledTimes(1) // No new calls from div1

         fireEvent.click(div2)
         expect(handler).toHaveBeenCalledTimes(2)
      })

      it('should work with setElementRef for manual attachment', async () => {
         const handler = vi.fn()
         const { result } = renderHook(() =>
            useEventListener({
               event: 'click',
               handler,
            })
         )

         const div = document.createElement('div')
         await waitFor(() => {
            result.current.setElementRef(div)
         })

         fireEvent.click(div)
         expect(handler).toHaveBeenCalledTimes(1)
      })
   })

   describe('Options and Edge Cases', () => {
      it('should respect shouldInjectEvent: false', () => {
         const addSpy = vi.spyOn(targetElement, 'addEventListener')
         renderHook(() =>
            useEventListener({
               target: () => targetElement,
               event: 'click',
               handler: vi.fn(),
               options: { shouldInjectEvent: false },
            })
         )

         expect(addSpy).not.toHaveBeenCalled()
      })

      it('should handle missing handler gracefully (should not attach)', () => {
         const addSpy = vi.spyOn(targetElement, 'addEventListener')
         renderHook(() =>
            useEventListener({
               target: () => targetElement,
               event: 'click',
            })
         )

         expect(addSpy).not.toHaveBeenCalled()
      })

      it('should re-attach when options like capture or passive change', () => {
         const addSpy = vi.spyOn(targetElement, 'addEventListener')
         const { rerender } = renderHook(
            ({ options }) =>
               useEventListener({
                  target: () => targetElement,
                  event: 'click',
                  handler: vi.fn(),
                  options,
               }),
            { initialProps: { options: { capture: true } } }
         )

         expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), expect.objectContaining({ capture: true }))

         rerender({ options: { capture: false } })
         expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function), expect.objectContaining({ capture: false }))
      })

      it('should respect once: true option', () => {
         const handler = vi.fn()
         renderHook(() =>
            useEventListener({
               target: () => targetElement,
               event: 'click',
               handler,
               options: { once: true },
            })
         )

         fireEvent.click(targetElement)
         fireEvent.click(targetElement)
         expect(handler).toHaveBeenCalledTimes(1)
      })

      it('should support layoutEffect: true', () => {
         const handler = vi.fn()
         renderHook(() =>
            useEventListener({
               target: () => targetElement,
               event: 'click',
               handler,
               layoutEffect: true,
            })
         )

         fireEvent.click(targetElement)
         expect(handler).toHaveBeenCalled()
      })
   })

   describe('Integration with React Components', () => {
      it('should maintain access to the latest state within the handler', () => {
         const log = vi.fn()

         const TestComponent = () => {
            const [count, setCount] = useState(0)
            const { setElementRef } = useEventListener({
               event: 'click',
               handler: () => log(count),
            })

            return (
               <div>
                  <button data-testid='inc' onClick={() => setCount((c) => c + 1)}>
                     Increment
                  </button>
                  <div ref={setElementRef} data-testid='target'>
                     Target
                  </div>
               </div>
            )
         }

         render(<TestComponent />)
         const incBtn = screen.getByTestId('inc')
         const target = screen.getByTestId('target')

         // Initial state
         fireEvent.click(target)
         expect(log).toHaveBeenLastCalledWith(0)

         // Update state
         fireEvent.click(incBtn)
         fireEvent.click(target)
         expect(log).toHaveBeenLastCalledWith(1)

         // Update state again
         fireEvent.click(incBtn)
         fireEvent.click(target)
         expect(log).toHaveBeenLastCalledWith(2)
      })
   })
})
