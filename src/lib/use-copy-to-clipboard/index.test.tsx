import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react'
import React, { useState } from 'react'
import useCopyToClipboard, { copyToClipboardFn } from '.'

describe('useCopyToClipboard', () => {
   // Mock clipboard API
   const mockWriteText = vi.fn()
   const originalClipboard = navigator.clipboard

   beforeEach(() => {
      vi.clearAllMocks()

      Object.defineProperty(navigator, 'clipboard', {
         value: {
            writeText: mockWriteText,
         },
         configurable: true,
      })

      mockWriteText.mockResolvedValue(undefined)
   })

   afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
         value: originalClipboard,
         configurable: true,
      })
   })

   describe('Hook behavior', () => {
      it('should return a function', () => {
         const { result } = renderHook(() => useCopyToClipboard())
         expect(typeof result.current).toBe('function')
         expect(result.current.length).toBe(3)
      })

      it('should use props callbacks when provided', async () => {
         const onSuccess = vi.fn()
         const onError = vi.fn()

         render(<DummyTestComponent onSuccess={onSuccess} onError={onError} />)

         const button = screen.getByTestId('copy-button')
         fireEvent.click(button)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith('test data')
            expect(onSuccess).toHaveBeenCalled()
         })
      })

      it('should prioritize callback parameters over props', async () => {
         const propsOnSuccess = vi.fn()
         const overrideOnSuccess = vi.fn()

         render(<DummyTestComponent onSuccess={propsOnSuccess} overrideOnSuccess={overrideOnSuccess} />)

         const button = screen.getByTestId('copy-button-with-callbacks')
         fireEvent.click(button)

         await waitFor(() => {
            expect(overrideOnSuccess).toHaveBeenCalled()
            expect(propsOnSuccess).not.toHaveBeenCalled()
         })
      })
   })

   describe('Successful copy scenarios', () => {
      it('should copy text successfully and call onSuccess', async () => {
         render(<DummyTestComponent />)

         const button = screen.getByTestId('copy-button')
         fireEvent.click(button)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith('test data')
            expect(screen.getByTestId('success-message')).toBeInTheDocument()
         })
      })

      it('should copy different text data', async () => {
         let customData = 'custom clipboard data'
         const { rerender } = render(<DummyTestComponent testData={customData} />)

         const button = screen.getByTestId('copy-button')
         fireEvent.click(button)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith(customData)
         })

         customData = 'updated text data'
         rerender(<DummyTestComponent testData={customData} />)

         fireEvent.click(button)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith(customData)
         })
      })

      it('should work with empty string', async () => {
         render(<DummyTestComponent testData='' />)

         const button = screen.getByTestId('copy-button')
         fireEvent.click(button)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith('')
         })
      })
   })

   describe('Error scenarios', () => {
      it('should handle clipboard writeText rejection', async () => {
         const error = new Error('Clipboard write failed')
         mockWriteText.mockRejectedValue(error)

         render(<DummyTestComponent />)

         const button = screen.getByTestId('copy-button')
         fireEvent.click(button)

         await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Clipboard write failed')
         })
      })

      it('should handle missing clipboard API', async () => {
         // Removing clipboard API
         Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            configurable: true,
         })

         render(<DummyTestComponent />)

         const button = screen.getByTestId('copy-button')
         fireEvent.click(button)

         await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Cliboard not available')
         })
      })

      it('should handle exceptions in try-catch block', async () => {
         // Mock clipboard to throw an exception
         Object.defineProperty(navigator, 'clipboard', {
            get() {
               throw new Error('Clipboard access denied')
            },
            configurable: true,
         })

         render(<DummyTestComponent />)

         const button = screen.getByTestId('copy-button')
         fireEvent.click(button)

         await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('Clipboard access denied')
         })
      })
   })
})

// copyToClipboardFn utility function
describe('copyToClipboardFn', () => {
   const mockWriteText = vi.fn()
   const originalClipboard = navigator.clipboard

   beforeEach(() => {
      vi.clearAllMocks()

      Object.defineProperty(navigator, 'clipboard', {
         value: {
            writeText: mockWriteText,
         },
         configurable: true,
      })

      mockWriteText.mockResolvedValue(undefined)
   })

   afterEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
         value: originalClipboard,
         configurable: true,
      })
   })

   describe('Successful operations', () => {
      it('should copy text and call onSuccess callback', async () => {
         const onSuccess = vi.fn()
         const onError = vi.fn()

         await copyToClipboardFn('test text', onSuccess, onError)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith('test text')
            expect(onSuccess).toHaveBeenCalled()
            expect(onError).not.toHaveBeenCalled()
         })
      })

      it('should work without callbacks', async () => {
         await expect(copyToClipboardFn('test text')).resolves.toBeUndefined()
         expect(mockWriteText).toHaveBeenCalledWith('test text')
      })

      it('should work with only onSuccess callback', async () => {
         const onSuccess = vi.fn()

         await copyToClipboardFn('test text', onSuccess)

         await waitFor(() => {
            expect(onSuccess).toHaveBeenCalled()
         })
      })

      it('should work with only onError callback', async () => {
         const onError = vi.fn()

         await copyToClipboardFn('test text', undefined, onError)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith('test text')
            expect(onError).not.toHaveBeenCalled()
         })
      })
   })

   describe('Error scenarios', () => {
      it('should call onError when writeText fails', async () => {
         const error = new Error('Write failed')
         mockWriteText.mockRejectedValue(error)

         const onSuccess = vi.fn()
         const onError = vi.fn()

         await copyToClipboardFn('test text', onSuccess, onError)

         await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(error)
            expect(onSuccess).not.toHaveBeenCalled()
         })
      })

      it('should handle missing clipboard API', async () => {
         Object.defineProperty(navigator, 'clipboard', {
            value: undefined,
            configurable: true,
         })

         const onError = vi.fn()

         await copyToClipboardFn('test text', undefined, onError)

         await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(
               expect.objectContaining({
                  message: 'Cliboard not available',
               })
            )
         })
      })

      it('should handle exceptions in try block', async () => {
         Object.defineProperty(navigator, 'clipboard', {
            get() {
               throw new Error('Access denied')
            },
            configurable: true,
         })

         const onError = vi.fn()

         await copyToClipboardFn('test text', undefined, onError)

         await waitFor(() => {
            expect(onError).toHaveBeenCalledWith(
               expect.objectContaining({
                  message: 'Access denied',
               })
            )
         })
      })

      it('should not throw when onError is not provided and error occurs', async () => {
         mockWriteText.mockRejectedValue(new Error('Write failed'))

         await expect(copyToClipboardFn('test text')).resolves.toBeUndefined()
      })
   })

   describe('Edge cases', () => {
      it('should handle special characters', async () => {
         const specialText = '🚀 Special chars: áéíóú ñ €$¥'
         const onSuccess = vi.fn()

         await copyToClipboardFn(specialText, onSuccess)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith(specialText)
            expect(onSuccess).toHaveBeenCalled()
         })
      })

      it('should handle very long text', async () => {
         const longText = 'a'.repeat(10000)
         const onSuccess = vi.fn()

         await copyToClipboardFn(longText, onSuccess)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith(longText)
            expect(onSuccess).toHaveBeenCalled()
         })
      })

      it('should handle newlines and tabs', async () => {
         const textWithWhitespace = 'Line 1\nLine 2\tTabbed'
         const onSuccess = vi.fn()

         await copyToClipboardFn(textWithWhitespace, onSuccess)

         await waitFor(() => {
            expect(mockWriteText).toHaveBeenCalledWith(textWithWhitespace)
            expect(onSuccess).toHaveBeenCalled()
         })
      })
   })
})

const DummyTestComponent: React.FC<{
   onSuccess?: () => void
   onError?: (err: Error) => void
   overrideOnSuccess?: () => void
   testData?: string
}> = ({ onSuccess, overrideOnSuccess, onError, testData = 'test data' }) => {
   const [copied, setCopied] = useState(false)
   const [error, setError] = useState<string | null>(null)

   const copyToClipboard = useCopyToClipboard({
      onSuccess: onSuccess || (() => setCopied(true)),
      onError: onError || ((err) => setError(err.message)),
   })

   return (
      <div>
         <button onClick={() => copyToClipboard(testData)} data-testid='copy-button'>
            Copy
         </button>
         <button
            onClick={() =>
               copyToClipboard(testData, () => {
                  setCopied(true)
                  overrideOnSuccess?.()
               })
            }
            data-testid='copy-button-with-callbacks'
         >
            Copy with callbacks
         </button>
         {copied && <div data-testid='success-message'>Copied!</div>}
         {error && <div data-testid='error-message'>{error}</div>}
      </div>
   )
}
