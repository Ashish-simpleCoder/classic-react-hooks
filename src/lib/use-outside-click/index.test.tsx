import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import useOutsideClick from '.'

describe('rendering', () => {
   it('should render with null as target', () => {
      // @ts-expect-error  handling the edge case if target is not type of function
      renderHook(() => useOutsideClick({ target: null }))
   })
})

describe('event trigger', () => {
   it('should not fire listener if target is null ', () => {
      // @ts-expect-error  handling the edge case if target is not type of function
      renderHook(() => useOutsideClick({ target: null }))

      const event = new Event('click')
      document.dispatchEvent(event)
   })

   it('should fire listener when clicked outside of target element', () => {
      const div = document.createElement('div')
      const ref = { current: div }
      const fn = vi.fn()

      renderHook(() => {
         useOutsideClick({ target: () => ref.current, handler: fn })
      })

      const event = new Event('click')
      document.dispatchEvent(event)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(event)
   })

   it('should not fire listener when clicked on target element or inside within that target element. But fire when clicked outside of the target element', () => {
      const div = document.createElement('div')
      const span = document.createElement('span')

      div.append(span)
      document.body.append(div)

      const fn = vi.fn()
      renderHook(() => {
         useOutsideClick({ target: () => div, handler: fn })
      })

      const event = new Event('click')
      div.dispatchEvent(event)
      expect(fn).toHaveBeenCalledTimes(0)

      span.dispatchEvent(event)
      expect(fn).toHaveBeenCalledTimes(0)

      const ev = new Event('click')
      document.dispatchEvent(ev)

      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(ev)
   })
})
