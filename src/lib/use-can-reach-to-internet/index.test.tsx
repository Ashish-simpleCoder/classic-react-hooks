import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useCanReachToInternet, { type CanReachToInternetOptions } from '.'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock navigator.onLine
const mockNavigator = {
   onLine: true,
}
Object.defineProperty(window, 'navigator', {
   value: mockNavigator,
   writable: true,
})

// Mock window.(add/remove)EventListener
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()
Object.defineProperty(window, 'addEventListener', {
   value: mockAddEventListener,
   writable: true,
})
Object.defineProperty(window, 'removeEventListener', {
   value: mockRemoveEventListener,
   writable: true,
})

describe('useCanReachToInternet', () => {
   beforeEach(() => {
      vi.clearAllMocks()
      mockNavigator.onLine = true
      mockFetch.mockClear()
   })

   afterEach(() => {
      vi.useRealTimers()
      vi.clearAllTimers()
   })

   describe('Initial state', () => {
      it('should initialize with correct default values', async () => {
         mockFetch.mockResolvedValue(new Response())

         const { result } = renderHook(() => useCanReachToInternet())

         expect(result.current.isOnline).toBe(true)
         expect(result.current.canReachToInternet).toBe(false)
         expect(result.current.isFullyConnected).toBe(false)
         expect(result.current.isNetworkPollingEnabled).toBe(true)
         expect(result.current.isCheckingConnection).toBe(true)
      })

      it('should prioritize custom options', () => {
         const options: CanReachToInternetOptions = {
            enableNetworkPolling: false,
            networkPollingInterval: 5000,
            testUrl: 'https://custom.test',
         }

         const { result } = renderHook(() => useCanReachToInternet(options))

         expect(result.current.isNetworkPollingEnabled).toBe(false)
      })
   })

   describe('Network connectivity checking', () => {
      it('should set canReachToInternet to true when fetch succeeds', async () => {
         mockFetch.mockResolvedValue(new Response())

         const { result } = renderHook(() => useCanReachToInternet())

         await waitFor(() => {
            expect(result.current.isFullyConnected).toBe(true)
            expect(result.current.canReachToInternet).toBe(true)
         })
      })

      it('should set canReachToInternet to false when fetch fails', async () => {
         mockFetch.mockRejectedValue(new Error('Network error'))

         const { result } = renderHook(() => useCanReachToInternet())

         await waitFor(() => {
            expect(result.current.canReachToInternet).toBe(false)
         })

         expect(result.current.isFullyConnected).toBe(false)
         expect(result.current.isCheckingConnection).toBe(false)
      })

      it('should use correct fetch options', async () => {
         mockFetch.mockResolvedValue(new Response())

         renderHook(() => useCanReachToInternet())

         await waitFor(() => {
            vi.clearAllTimers()
            expect(mockFetch).toHaveBeenCalledWith(
               'https://dns.google',
               expect.objectContaining({
                  method: 'HEAD',
                  cache: 'no-cache',
                  mode: 'no-cors',
                  headers: {
                     'Cache-Control': 'no-cache, no-store, must-revalidate',
                     Pragma: 'no-cache',
                  },
                  signal: expect.any(AbortSignal),
               })
            )
         })
      })

      it('should use custom testUrl when provided', async () => {
         mockFetch.mockResolvedValue(new Response())
         const customUrl = 'https://custom.test'

         renderHook(() => useCanReachToInternet({ testUrl: customUrl }))

         expect(mockFetch).toHaveBeenCalledWith(customUrl, expect.any(Object))
      })
   })

   describe('Network polling', () => {
      beforeEach(() => {
         vi.useFakeTimers()
      })
      afterEach(() => {
         vi.useRealTimers()
      })

      it('should poll network at specified intervals when enabled', async () => {
         mockFetch.mockResolvedValue(new Response())

         renderHook(() => useCanReachToInternet({ networkPollingInterval: 1000 }))

         expect(mockFetch).toHaveBeenCalledTimes(1)

         await vi.advanceTimersByTimeAsync(1000)
         expect(mockFetch).toHaveBeenCalledTimes(2)

         await vi.advanceTimersByTimeAsync(1000)
         expect(mockFetch).toHaveBeenCalledTimes(3)

         await vi.advanceTimersByTimeAsync(3000)
         expect(mockFetch).toHaveBeenCalledTimes(6)
      })

      it('should not poll when network polling is disabled', async () => {
         mockFetch.mockResolvedValue(new Response())

         renderHook(() => useCanReachToInternet({ enableNetworkPolling: false }))

         expect(mockFetch).toHaveBeenCalledTimes(1)
         vi.advanceTimersByTimeAsync(1000)
         expect(mockFetch).toHaveBeenCalledTimes(1)
      })

      it('should stop polling when stopNetworkPolling is called', async () => {
         mockFetch.mockResolvedValue(new Response())

         const { result } = renderHook(() => useCanReachToInternet({ networkPollingInterval: 1000 }))

         expect(mockFetch).toHaveBeenCalledTimes(1)

         act(() => {
            result.current.stopNetworkPolling()
         })
         expect(result.current.isNetworkPollingEnabled).toBe(false)
         expect(mockFetch).toHaveBeenCalledTimes(2)

         vi.advanceTimersByTimeAsync(1000)
         expect(mockFetch).toHaveBeenCalledTimes(2)
      })

      it('should start polling when startNetworkPolling is called', async () => {
         mockFetch.mockResolvedValue(new Response())

         const { result } = renderHook(() => useCanReachToInternet({ enableNetworkPolling: false }))

         expect(mockFetch).toHaveBeenCalledTimes(1)
         expect(result.current.isNetworkPollingEnabled).toBe(false)

         await vi.advanceTimersByTimeAsync(3000)
         expect(mockFetch).toHaveBeenCalledTimes(1)

         act(() => {
            result.current.startNetworkPolling()
         })

         expect(result.current.isNetworkPollingEnabled).toBe(true)
         expect(mockFetch).toHaveBeenCalledTimes(2)

         await vi.advanceTimersByTimeAsync(3000)
         expect(mockFetch).toHaveBeenCalledTimes(3)

         await vi.advanceTimersByTimeAsync(3000)
         expect(mockFetch).toHaveBeenCalledTimes(4)
      })
   })

   describe('Manual network checking', () => {
      it('should check network when forceCheckNetwork is called', async () => {
         mockFetch.mockResolvedValue(new Response())

         const { result } = renderHook(() => useCanReachToInternet({ enableNetworkPolling: false }))

         expect(mockFetch).toHaveBeenCalledTimes(1)

         act(() => {
            result.current.forceCheckNetwork()
         })

         expect(mockFetch).toHaveBeenCalledTimes(2)
      })

      it('should update isCheckingConnection state during manual check', async () => {
         let resolvePromise: (value: Response) => void
         const pendingPromise = new Promise<Response>((resolve) => {
            resolvePromise = resolve
         })
         mockFetch.mockReturnValue(pendingPromise)

         const { result } = renderHook(() => useCanReachToInternet({ enableNetworkPolling: false }))

         act(() => {
            result.current.forceCheckNetwork()
         })

         expect(result.current.isCheckingConnection).toBe(true)

         act(() => {
            resolvePromise(new Response())
         })

         await waitFor(() => {
            expect(result.current.isCheckingConnection).toBe(false)
         })
      })
   })

   describe('Browser online/offline detection', () => {
      it('should return false for canReachToInternet when browser is offline', async () => {
         mockNavigator.onLine = false

         const { result } = renderHook(() => useCanReachToInternet())

         await waitFor(() => {
            expect(result.current.isOnline).toBe(false)
            expect(result.current.canReachToInternet).toBe(false)
            expect(result.current.isFullyConnected).toBe(false)
         })

         // Should not make fetch call when offline
         expect(mockFetch).not.toHaveBeenCalled()
      })

      it('should listen to online/offline events', () => {
         renderHook(() => useCanReachToInternet())

         expect(mockAddEventListener).toHaveBeenCalledWith('online', expect.any(Function))
         expect(mockAddEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
      })

      it('should update the <canReachToInternet> state when online/offline events are triggered without polling enabled', async () => {
         const { result, rerender } = renderHook(() => useCanReachToInternet({ enableNetworkPolling: false }))

         await waitFor(() => {
            expect(result.current.canReachToInternet).toBe(true)
         })

         // Should update the state when offline
         await waitFor(() => {
            mockNavigator.onLine = false
            rerender()
            expect(result.current.canReachToInternet).toBe(false)
         })

         // Should update the state when online
         await waitFor(() => {
            mockNavigator.onLine = true
            rerender()
            expect(result.current.canReachToInternet).toBe(true)
         })
      })
   })

   describe('Cleanup and abort handling', () => {
      it('should abort pending requests on unmount', async () => {
         mockFetch.mockImplementation(() => {
            // Never resolving the operation for aborting at unmount phase
            return new Promise(() => {})
         })

         const { unmount } = renderHook(() => useCanReachToInternet())

         expect(mockFetch).toHaveBeenCalled()

         const abortSpy = vi.spyOn(AbortController.prototype, 'abort')

         unmount()

         expect(abortSpy).toHaveBeenCalledWith('cleanup')
      })

      it('should not update state if request was aborted', async () => {
         const abortError = new Error('AbortError')
         abortError.name = 'AbortError'

         mockFetch.mockRejectedValue(abortError)

         const { result } = renderHook(() => useCanReachToInternet())

         // The state should not be updated when request is aborted
         await waitFor(() => {
            expect(result.current.isCheckingConnection).toBe(false)
         })
      })
   })

   describe('getCanReachToInternetStatus method', () => {
      it('should return current canReachToInternet status', async () => {
         mockFetch.mockResolvedValue(new Response())

         const { result } = renderHook(() => useCanReachToInternet())

         await waitFor(() => {
            expect(result.current.canReachToInternet).toBe(true)
         })

         expect(result.current.getCanReachToInternetStatus()).toBe(true)
      })

      it('should return false when cannot reach internet', async () => {
         mockFetch.mockRejectedValue(new Error('Network error'))

         const { result } = renderHook(() => useCanReachToInternet())

         await waitFor(() => {
            expect(result.current.canReachToInternet).toBe(false)
         })

         expect(result.current.getCanReachToInternetStatus()).toBe(false)
      })
   })

   describe('Edge cases', () => {
      it('should handle multiple rapid calls to forceCheckNetwork', async () => {
         mockFetch.mockResolvedValue(new Response())

         const { result } = renderHook(() => useCanReachToInternet({ enableNetworkPolling: false }))

         // Make multiple rapid calls
         act(() => {
            result.current.forceCheckNetwork()
            result.current.forceCheckNetwork()
            result.current.forceCheckNetwork()
         })

         await waitFor(() => {
            expect(result.current.isCheckingConnection).toBe(false)
         })

         // Should handle gracefully without errors
         expect(result.current.canReachToInternet).toBe(true)
      })

      it('should handle network status changes during polling', async () => {
         mockFetch.mockResolvedValue(new Response())

         const { result, rerender } = renderHook(
            ({ online }) => {
               mockNavigator.onLine = online
               return useCanReachToInternet({ networkPollingInterval: 1000 })
            },
            { initialProps: { online: true } }
         )

         await waitFor(() => {
            expect(result.current.canReachToInternet).toBe(true)
         })

         // Simulate going offline
         rerender({ online: false })

         await waitFor(() => {
            expect(result.current.isOnline).toBe(false)
            expect(result.current.canReachToInternet).toBe(false)
            expect(result.current.isFullyConnected).toBe(false)
         })
      })
   })
})
