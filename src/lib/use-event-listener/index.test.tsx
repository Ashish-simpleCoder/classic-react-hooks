import { fireEvent, render, renderHook, screen } from '@testing-library/react'
import { expect, vi } from 'vitest'
import { useEventListener } from '.'
import { ElementRef, useRef, useState } from 'react'
import { EvTarget } from '../../types'

describe('mounting and unmounting', () => {
   it('should render', () => {
      renderHook(() =>
         useEventListener({
            target: () => null,
            event: 'click',
            options: {},
         })
      )

      // @ts-expect-error  handling the edge case if target is not type of function
      renderHook(() => useEventListener({ target: null, event: 'click' }))
   })

   it('should not add event if handler is not provided', () => {
      const div = document.createElement('div')
      const addSpy = vi.spyOn(div, 'addEventListener')
      const removeSpy = vi.spyOn(div, 'removeEventListener')
      const fn = vi.fn()

      renderHook(() => {
         useEventListener({
            target: () => div,
            event: 'click',
         })
      })

      expect(addSpy).toHaveBeenCalledTimes(0)
      expect(removeSpy).not.toHaveBeenCalled()

      renderHook(() => {
         useEventListener({
            target: () => div,
            event: 'click',
            handler: fn,
            options: { shouldInjectEvent: false },
         })
      })
      expect(addSpy).toHaveBeenCalledTimes(0)
      expect(removeSpy).not.toHaveBeenCalled()

      renderHook(() => {
         useEventListener({ target: () => null, event: 'click', handler: fn })
      })
      expect(addSpy).toHaveBeenCalledTimes(0)
      expect(removeSpy).not.toHaveBeenCalled()
   })

   it('should remove event on-un-mount', () => {
      const div = document.createElement('div')
      const addSpy = vi.spyOn(div, 'addEventListener')
      const removeSpy = vi.spyOn(div, 'removeEventListener')
      const fn = vi.fn()

      const { unmount } = renderHook(() => {
         useEventListener({ target: () => div, event: 'click', handler: fn })
      })

      unmount()
      expect(addSpy).toHaveBeenCalledTimes(1) // should be 1 on unmount
      expect(removeSpy).toHaveBeenCalledTimes(1)
   })

   it('should not re-run the addEventListner if the <target>,<event> and <handler> props are not changed', () => {
      const div = document.createElement('div')
      const addSpy = vi.spyOn(div, 'addEventListener')
      const removeSpy = vi.spyOn(div, 'removeEventListener')

      const fn = vi.fn()

      const { rerender } = renderHook(() => {
         useEventListener({ target: () => div, event: 'click', handler: fn })
      })

      expect(addSpy).toHaveBeenCalledTimes(1)
      rerender()
      expect(addSpy).toHaveBeenCalledTimes(1)
      expect(removeSpy).not.toHaveBeenCalled()
   })

   it('should re-run the effect if the <target>,<event> and <options.key> props are changed', () => {
      const div = document.createElement('div')
      div.textContent = 'div'

      const addSpy = vi.spyOn(div, 'addEventListener')
      const removeSpy = vi.spyOn(div, 'removeEventListener')

      const handler = vi.fn()
      const t = () => div

      const { rerender, unmount } = renderHook(
         (props: { capture: boolean; shouldInjectEvent: boolean; event: keyof DocumentEventMap; target: EvTarget }) => {
            useEventListener({
               target: props.target,
               event: props.event,
               handler: handler,
               options: {
                  capture: props.capture,
                  shouldInjectEvent: props.shouldInjectEvent,
               },
            })
         },
         { initialProps: { capture: true, target: t, event: 'click', shouldInjectEvent: true } }
      )

      expect(addSpy).toHaveBeenCalledTimes(1)

      // re-render with updated options.capture prop
      rerender({ capture: false, target: t, event: 'click', shouldInjectEvent: true })
      expect(addSpy).toHaveBeenCalledTimes(2)
      expect(removeSpy).toHaveBeenCalledTimes(1)

      // re-render with updated options.shouldInjectEvent prop
      rerender({ shouldInjectEvent: false, target: t, event: 'click', capture: false })
      expect(addSpy).toHaveBeenCalledTimes(2)
      expect(removeSpy).toHaveBeenCalledTimes(2)

      // re-render with updated event prop
      rerender({ event: 'mousedown', shouldInjectEvent: true, capture: false, target: t })
      expect(addSpy).toHaveBeenCalledTimes(3)
      expect(removeSpy).toHaveBeenCalledTimes(2)

      const div2 = document.createElement('div')
      div2.textContent = 'div2'
      const addSpy2 = vi.spyOn(div2, 'addEventListener')
      const removeSpy2 = vi.spyOn(div2, 'removeEventListener')

      // re-render with updated target
      rerender({ target: () => div2, capture: false, event: 'mousedown', shouldInjectEvent: true })
      expect(addSpy2).toHaveBeenCalledTimes(1)
      expect(removeSpy).toHaveBeenCalledTimes(3) // remove old target event

      // extra re-render test same target
      rerender({ target: () => div2, capture: false, event: 'mousedown', shouldInjectEvent: true })
      expect(addSpy2).toHaveBeenCalledTimes(1)

      // unmount
      expect(removeSpy2).not.toHaveBeenCalled()
      unmount()
      expect(addSpy2).toHaveBeenCalledTimes(1)
      expect(removeSpy2).toHaveBeenCalledTimes(1)
   })
})

describe('event trigger', () => {
   it('should trigger event with proper event context', () => {
      const div = document.createElement('div')
      const fn = vi.fn()

      renderHook(() => useEventListener({ target: () => div, event: 'click', handler: fn }))

      const ev = new Event('click')

      // first trigger
      div.dispatchEvent(ev)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(ev)

      // second trigger
      div.dispatchEvent(ev)
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenCalledWith(ev)
   })

   it('should not trigger event after unmount', () => {
      const div = document.createElement('div')
      const fn = vi.fn()

      // const { unmount } = renderHook(() => useEventListener(() => div, 'click', handler))
      const { unmount } = renderHook(() => useEventListener({ target: () => div, event: 'click', handler: fn }))

      // unmount
      unmount()

      // test whether it is being triggered or not
      const ev = new Event('click')
      div.dispatchEvent(ev)
      expect(fn).not.toHaveBeenCalled()
   })
})

describe('integration with react component', () => {
   it('should log the latest value of counter in handler', () => {
      const fn = vi.fn()
      const { result } = renderHook(() => useRef<ElementRef<'div'>>(null))

      const Wrapper = () => {
         const [counter, setCounter] = useState(0)
         useEventListener({
            target: () => result.current.current,
            event: 'click',
            handler: () => {
               fn(counter)
            },
         })

         return (
            <div>
               <button data-testid='btn' onClick={() => setCounter((c) => c + 1)}>
                  update counter {counter}
               </button>
               <div ref={result.current} data-testid='log'>
                  log value
               </div>
            </div>
         )
      }

      render(<Wrapper />)

      fireEvent.click(screen.getByTestId('btn'))
      result.current.current?.click()
      expect(fn).toHaveBeenNthCalledWith(1, 1)

      fireEvent.click(screen.getByTestId('btn'))
      result.current.current?.click()
      expect(fn).toHaveBeenNthCalledWith(2, 2)
   })

   it('should be able to set target using `setElementRef` function', () => {
      const fn = vi.fn()

      const Wrapper = () => {
         const [counter, setCounter] = useState(0)
         const { setElementRef } = useEventListener({
            event: 'click',
            handler: () => {
               fn(counter)
            },
         })

         return (
            <div>
               <button data-testid='btn' onClick={() => setCounter((c) => c + 1)}>
                  update counter {counter}
               </button>
               <div ref={setElementRef} data-testid='log'>
                  log value
               </div>
            </div>
         )
      }

      render(<Wrapper />)

      fireEvent.click(screen.getByTestId('btn'))
      fireEvent.click(screen.getByTestId('log'))
      expect(fn).toHaveBeenNthCalledWith(1, 1)

      fireEvent.click(screen.getByTestId('btn'))
      fireEvent.click(screen.getByTestId('log'))
      expect(fn).toHaveBeenNthCalledWith(2, 2)
   })
})
