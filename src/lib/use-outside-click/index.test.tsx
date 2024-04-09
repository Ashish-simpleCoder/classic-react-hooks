import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useOutsideClick from '.'

describe('use-outside-click', () => {
   it('should render', () => {
      renderHook(() => useOutsideClick(null, () => {}))
   })

   it('should add listener on-mount and remove it on un-mount', () => {
      const div = document.createElement('div')
      const addSpy = vi.spyOn(document, 'addEventListener')
      const removeSpy = vi.spyOn(document, 'removeEventListener')

      const { rerender, unmount } = renderHook(() => {
         useOutsideClick(
            () => div,
            () => {}
         )
      })

      expect(addSpy).toHaveBeenCalledTimes(1)
      expect(removeSpy).toHaveBeenCalledTimes(0)

      rerender()
      expect(addSpy).toHaveBeenCalledTimes(1)
      expect(removeSpy).toHaveBeenCalledTimes(0)

      unmount()
      expect(addSpy).toHaveBeenCalledTimes(1)
      expect(removeSpy).toHaveBeenCalledTimes(1)
   })

   it('should fire listener when clicked outside of target element', () => {
      const div = document.createElement('div')

      const listener = vi.fn()
      renderHook(() => {
         useOutsideClick(() => div, listener)
      })

      const event = new Event('click')
      document.dispatchEvent(event)

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(event)
   })

   it('should not fire listener when clicked on target element or inside within it', () => {
      const div = document.createElement('div')
      const span = document.createElement('span')

      div.append(span)
      document.body.append(div)

      const listener = vi.fn()
      renderHook(() => {
         useOutsideClick(() => div, listener)
      })

      const event = new Event('click', { bubbles: true })
      div.dispatchEvent(event)
      expect(listener).toHaveBeenCalledTimes(0)

      span.dispatchEvent(event)
      expect(listener).toHaveBeenCalledTimes(0)
   })
})
