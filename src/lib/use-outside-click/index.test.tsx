import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useOutsideClick from '.'

describe('use-outside-click', () => {
   describe('mounting', () => {
      it('should render with null as target', () => {
         // @ts-expect-error  handling the edge case if target is not type of function
         renderHook(() => useOutsideClick({ target: null }))
      })
   })

   describe('event trigger', () => {
      it('should not fire listener if target is null ', () => {
         // @ts-expect-error  handling the edge case if target is not type of function
         renderHook(() => useOutsideClick({ target: null }))

         const event = new Event('click', { bubbles: true })
         document.dispatchEvent(event)
      })

      it('should fire listener when clicked outside of target', () => {
         const div = document.createElement('div')
         const ref = { current: div }
         const fn = vi.fn()

         renderHook(() => {
            useOutsideClick({ target: () => ref.current, handler: fn })
         })

         const event = new Event('click', { bubbles: true })
         document.dispatchEvent(event)

         expect(fn).toHaveBeenCalledTimes(1)
         expect(fn).toHaveBeenCalledWith(event)
      })

      it('should fire listener when clicked outside of target, when `setElementRef` is used', () => {
         const div = document.createElement('div')
         document.body.append(div) // Append to body to make it part of the DOM

         const fn = vi.fn()

         const { result, rerender } = renderHook(() => {
            return useOutsideClick({ handler: fn })
         })

         result.current.setElementRef(div)
         rerender()

         const event = new Event('click', { bubbles: true })
         // Simulate click outside of div
         document.dispatchEvent(event)

         expect(fn).toHaveBeenCalledTimes(1)
         expect(fn).toHaveBeenCalledWith(event)

         document.body.removeChild(div) // Clean up
      })

      it('should not fire when clicked on target', () => {
         const div = document.createElement('div')

         document.body.append(div)

         const fn = vi.fn()
         renderHook(() => {
            useOutsideClick({ target: () => div, handler: fn })
         })

         const event = new Event('click', { bubbles: true })
         div.dispatchEvent(event)

         expect(fn).toHaveBeenCalledTimes(0)
      })

      it('should not fire when clicked inside target', () => {
         const div = document.createElement('div')
         const span = document.createElement('span')

         div.append(span)
         document.body.append(div)

         const fn = vi.fn()
         renderHook(() => {
            useOutsideClick({ target: () => div, handler: fn })
         })

         const event = new Event('click', { bubbles: true })
         span.dispatchEvent(event)

         expect(fn).toHaveBeenCalledTimes(0)
      })

      it('should not fire listener when clicked on target, when `setElementRef` is used', () => {
         const div = document.createElement('div')

         document.body.append(div)

         const fn = vi.fn()
         const { result, rerender } = renderHook(() => {
            return useOutsideClick({ handler: fn })
         })
         result.current.setElementRef(div)
         rerender()

         const event = new Event('click', { bubbles: true })
         div.dispatchEvent(event)
         expect(fn).toHaveBeenCalledTimes(0)
      })
   })
})
