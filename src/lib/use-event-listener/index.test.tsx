import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useEventListener } from '.'

describe('use-outside-click', () => {
   it('should render', () => {
      renderHook(() => useEventListener(null, 'click', () => {}))
   })

   it('should add listener on-mount and remove it on un-mount', () => {
      const div = document.createElement('div')
      const addSpy = vi.spyOn(div, 'addEventListener')
      const removeSpy = vi.spyOn(div, 'removeEventListener')

      const { rerender, unmount } = renderHook(() => {
         useEventListener(
            () => div,
            'resize',
            () => {},
            { passive: true }
         )
      })

      expect(addSpy).toHaveBeenCalledTimes(1)
      expect(removeSpy).toHaveBeenCalledTimes(0)

      rerender()
      expect(addSpy).toHaveBeenCalledTimes(2)
      expect(removeSpy).toHaveBeenCalledTimes(1)

      unmount()
      expect(addSpy).toHaveBeenCalledTimes(2)
      expect(removeSpy).toHaveBeenCalledTimes(2)
   })

   it('should fire listener on event trigger with proper context', () => {
      const div = document.createElement('div')
      const listener = vi.fn()
      renderHook(() => {
         useEventListener(div, 'click', listener, { passive: true })
      })

      const event = new Event('click')
      div.dispatchEvent(event)

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(event)
   })

   it('should remove listener when shouldInjectEvent becomes false', () => {
      const div = document.createElement('div')
      const removeSpy = vi.spyOn(div, 'removeEventListener')

      const listener = vi.fn()
      const { rerender } = renderHook((shouldInjectEvent: boolean = true) => {
         useEventListener(div, 'click', listener, { passive: true }, shouldInjectEvent)
      })

      const event = new Event('click')
      div.dispatchEvent(event)

      expect(listener).toHaveBeenCalledTimes(1)
      expect(listener).toHaveBeenCalledWith(event)

      rerender(false)
      expect(listener).toHaveBeenCalledTimes(1)
      expect(removeSpy).toHaveBeenCalledTimes(1)
   })
})
