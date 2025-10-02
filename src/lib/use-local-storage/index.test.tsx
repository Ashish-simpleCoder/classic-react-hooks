import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useLocalStorage from '.' // adjust path as needed

// Mock localStorage
const createMockStorage = () => {
   let store: Record<string, string> = {}
   return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
         store[key] = value.toString()
      }),
      removeItem: vi.fn((key: string) => {
         delete store[key]
      }),
      clear: vi.fn(() => {
         store = {}
      }),
      _getStore: () => ({ ...store }),
      _setStore: (newStore: Record<string, string>) => {
         store = { ...newStore }
      },
   }
}

// Mock event system
const createMockEventSystem = () => {
   const eventListeners: Record<string, Function[]> = {}

   return {
      addEventListener: vi.fn((event: string, callback: Function) => {
         if (!eventListeners[event]) {
            eventListeners[event] = []
         }
         eventListeners[event]?.push(callback)
      }),
      removeEventListener: vi.fn((event: string, callback: Function) => {
         if (eventListeners[event]) {
            const index = eventListeners[event]?.indexOf(callback)
            if (index && index > -1) {
               eventListeners[event]?.splice(index, 1)
            }
         }
      }),
      dispatchEvent: vi.fn((event: Event) => {
         const listeners = eventListeners[event.type] || []
         listeners.forEach((listener) => listener(event))
      }),
      _triggerCustomEvent: (eventType: string) => {
         const listeners = eventListeners[eventType] || []
         listeners.forEach((listener) => listener(new Event(eventType)))
      },
      _triggerStorageEvent: (key: string, newValue: string) => {
         const listeners = eventListeners['storage'] || []
         const event = new StorageEvent('storage', { key, newValue })
         listeners.forEach((listener) => listener(event))
      },
      _getListeners: () => ({ ...eventListeners }),
      _clearListeners: () => {
         Object.keys(eventListeners).forEach((key) => {
            eventListeners[key] = []
         })
      },
   }
}

let mockStorage: ReturnType<typeof createMockStorage>
let mockEvents: ReturnType<typeof createMockEventSystem>

// Global setup
beforeEach(() => {
   mockStorage = createMockStorage()
   mockEvents = createMockEventSystem()

   Object.defineProperty(window, 'localStorage', { value: mockStorage })
   Object.defineProperty(window, 'addEventListener', { value: mockEvents.addEventListener })
   Object.defineProperty(window, 'removeEventListener', { value: mockEvents.removeEventListener })
   Object.defineProperty(window, 'dispatchEvent', { value: mockEvents.dispatchEvent })

   vi.clearAllMocks()
})

afterEach(() => {
   vi.clearAllMocks()
})

describe('useLocalStorage', () => {
   describe('Initialization Tests', () => {
      it('should initialize with primitive value when localStorage is empty', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'test-primitive', initialValue: 'hello' }))

         expect(result.current[0]).toBe('hello')
         expect(mockStorage.getItem).toHaveBeenCalledWith('test-primitive')
      })

      it('should initialize with object value when localStorage is empty', () => {
         const initialObj = { name: 'John', age: 30 }
         const { result } = renderHook(() => useLocalStorage({ key: 'test-object', initialValue: initialObj }))

         expect(result.current[0]).toEqual(initialObj)
      })

      it('should initialize with array value when localStorage is empty', () => {
         const initialArray = [1, 2, 3, 'test', { nested: true }]
         const { result } = renderHook(() => useLocalStorage({ key: 'test-array', initialValue: initialArray }))

         expect(result.current[0]).toEqual(initialArray)
      })

      it('should initialize with function-based value', () => {
         const initialValueFn = vi.fn(() => ({ computed: true }))
         const { result } = renderHook(() =>
            useLocalStorage({ key: 'test-function-init', initialValue: initialValueFn })
         )

         expect(initialValueFn).toHaveBeenCalledOnce()
         expect(result.current[0]).toEqual(expect.objectContaining({ computed: true }))
      })

      it('should initialize with null value', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'test-null', initialValue: null }))

         expect(result.current[0]).toBe(null)
      })

      it('should initialize with undefined value', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'test-undefined', initialValue: undefined }))

         expect(result.current[0]).toBe(undefined)
      })

      it('should initialize with boolean value', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'test-boolean', initialValue: false }))

         expect(result.current[0]).toBe(false)
      })

      it('should initialize with number value including zero', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'test-zero', initialValue: 0 }))

         expect(result.current[0]).toBe(0)
      })
   })

   describe('LocalStorage Retrieval Tests', () => {
      it('should retrieve existing string value from localStorage', () => {
         mockStorage._setStore({ 'existing-key': '"stored-string"' })

         const { result } = renderHook(() => useLocalStorage({ key: 'existing-key', initialValue: 'default' }))

         expect(result.current[0]).toBe('stored-string')
      })

      it('should retrieve existing object from localStorage', () => {
         const storedObj = { user: 'Alice', settings: { theme: 'dark' } }
         mockStorage._setStore({ 'obj-key': JSON.stringify(storedObj) })

         const { result } = renderHook(() => useLocalStorage({ key: 'obj-key', initialValue: {} }))

         expect(result.current[0]).toEqual(storedObj)
      })

      it('should retrieve existing array from localStorage', () => {
         const storedArray = ['item1', 'item2', { nested: 'object' }]
         mockStorage._setStore({ 'array-key': JSON.stringify(storedArray) })

         const { result } = renderHook(() => useLocalStorage({ key: 'array-key', initialValue: [] }))

         expect(result.current[0]).toEqual(storedArray)
      })

      it('should retrieve boolean values from localStorage', () => {
         mockStorage._setStore({ 'bool-key': 'true' })

         const { result } = renderHook(() => useLocalStorage({ key: 'bool-key', initialValue: false }))

         expect(result.current[0]).toBe(true)
      })

      it('should retrieve numeric values from localStorage', () => {
         mockStorage._setStore({ 'num-key': '42' })

         const { result } = renderHook(() => useLocalStorage({ key: 'num-key', initialValue: 0 }))

         expect(result.current[0]).toBe(42)
      })
   })

   describe('State Update Tests', () => {
      it('should update state with primitive value', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'update-primitive', initialValue: 'initial' }))

         act(() => {
            result.current[1]('updated')
         })

         expect(result.current[0]).toBe('updated')
         expect(mockStorage.setItem).toHaveBeenCalledWith('update-primitive', '"updated"')
      })

      it('should update state with object value', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'update-object', initialValue: { count: 0 } }))

         const newObj = { count: 5, name: 'test' }
         act(() => {
            result.current[1](newObj)
         })

         expect(result.current[0]).toEqual(newObj)
         expect(mockStorage.setItem).toHaveBeenCalledWith('update-object', JSON.stringify(newObj))
      })

      it('should update state with function-based setter', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'update-function', initialValue: 10 }))

         act(() => {
            result.current[1]((prev) => prev * 2)
         })

         expect(result.current[0]).toBe(20)
         expect(mockStorage.setItem).toHaveBeenCalledWith('update-function', '20')
      })

      it('should update state with complex function-based setter', () => {
         const initialState = { items: ['a', 'b'], count: 2 }
         const { result } = renderHook(() => useLocalStorage({ key: 'update-complex', initialValue: initialState }))

         act(() => {
            result.current[1]((prev) => ({
               ...prev,
               items: [...prev.items, 'c'],
               count: prev.count + 1,
            }))
         })

         expect(result.current[0]).toEqual({
            items: ['a', 'b', 'c'],
            count: 3,
         })
      })

      it('should handle multiple rapid updates', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'rapid-updates', initialValue: 0 }))

         act(() => {
            result.current[1](1)
            result.current[1](2)
            result.current[1](3)
         })

         expect(result.current[0]).toBe(3)
         expect(mockStorage.setItem).toHaveBeenCalledTimes(3)
      })

      it('should update with null value', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'update-null', initialValue: 'something' }))

         act(() => {
            // @ts-expect-error Forcefully passing null
            result.current[1](null)
         })

         expect(result.current[0]).toBe(null)
         expect(mockStorage.setItem).toHaveBeenCalledWith('update-null', 'null')
      })

      it('should update with undefined value', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'update-undefined', initialValue: 'something' }))

         act(() => {
            // @ts-expect-error Forcefully passing undefined
            result.current[1](undefined)
         })

         expect(result.current[0]).toBe(undefined)
         expect(mockStorage.setItem).toHaveBeenCalledWith('update-undefined', 'null')
      })
   })

   describe('Event System Tests', () => {
      it('should set up event listeners on mount', () => {
         renderHook(() => useLocalStorage({ key: 'event-test', initialValue: 'initial' }))

         expect(mockEvents.addEventListener).toHaveBeenCalledWith('event-test', expect.any(Function))
         expect(mockEvents.addEventListener).toHaveBeenCalledWith('storage', expect.any(Function))
         expect(mockEvents.addEventListener).toHaveBeenCalledTimes(2)
      })

      it('should clean up event listeners on unmount', () => {
         const { unmount } = renderHook(() => useLocalStorage({ key: 'cleanup-test', initialValue: 'initial' }))

         unmount()

         expect(mockEvents.removeEventListener).toHaveBeenCalledWith('cleanup-test', expect.any(Function))
         expect(mockEvents.removeEventListener).toHaveBeenCalledWith('storage', expect.any(Function))
         expect(mockEvents.removeEventListener).toHaveBeenCalledTimes(2)
      })

      it('should dispatch custom event on state update', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'dispatch-test', initialValue: 'initial' }))

         act(() => {
            result.current[1]('updated')
         })

         expect(mockEvents.dispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
               type: 'dispatch-test',
            })
         )
      })

      it('should respond to custom events from other instances', async () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'sync-test', initialValue: 'initial' }))

         // Simulate external update
         mockStorage._setStore({ 'sync-test': '"external-update"' })

         // Trigger custom event
         act(() => {
            mockEvents._triggerCustomEvent('sync-test')
         })

         await waitFor(() => {
            expect(result.current[0]).toBe('external-update')
         })
      })

      it('should respond to storage events from other tabs', async () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'cross-tab-test', initialValue: 'initial' }))

         // Simulate cross-tab update
         mockStorage._setStore({ 'cross-tab-test': '"from-other-tab"' })

         act(() => {
            mockEvents._triggerStorageEvent('cross-tab-test', '"from-other-tab"')
         })

         await waitFor(() => {
            expect(result.current[0]).toBe('from-other-tab')
         })
      })

      it('should ignore storage events for different keys', async () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'specific-key', initialValue: 'initial' }))

         act(() => {
            mockEvents._triggerStorageEvent('different-key', '"different-value"')
         })

         // Should remain unchanged
         expect(result.current[0]).toBe('initial')
      })
   })

   describe('Key Change Tests', () => {
      it('should handle key changes and migrate data to new key', () => {
         let key = 'original-key'
         const { result, rerender } = renderHook(() => useLocalStorage({ key, initialValue: 'initial' }))

         // Set value with original key
         act(() => {
            result.current[1]('value-for-original')
         })

         // Change key
         key = 'new-key'
         rerender()

         // Should remove old key and set new key with the cached value
         expect(mockStorage.removeItem).toHaveBeenCalledWith('original-key')
         expect(mockStorage.setItem).toHaveBeenCalledWith('new-key', '"value-for-original"')
      })

      it('should update event listeners when key changes', () => {
         let key = 'event-key-1'
         const { rerender } = renderHook(() => useLocalStorage({ key, initialValue: 'initial' }))

         // Change key
         key = 'event-key-2'
         rerender()

         // Should remove old listeners and add new ones
         expect(mockEvents.removeEventListener).toHaveBeenCalledWith('event-key-1', expect.any(Function))
         expect(mockEvents.addEventListener).toHaveBeenCalledWith('event-key-2', expect.any(Function))
      })

      it('should handle multiple key changes', () => {
         let key = 'key-1'
         const { result, rerender } = renderHook(() => useLocalStorage({ key, initialValue: 0 }))

         act(() => {
            result.current[1](1)
         })

         key = 'key-2'
         rerender()

         act(() => {
            result.current[1](2)
         })

         key = 'key-3'
         rerender()

         expect(mockStorage.removeItem).toHaveBeenCalledWith('key-1')
         expect(mockStorage.removeItem).toHaveBeenCalledWith('key-2')
         expect(mockStorage.setItem).toHaveBeenCalledWith('key-3', '2')
      })
   })

   describe('Error Handling Tests', () => {
      it('should handle JSON.parse errors and return initial value', () => {
         const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
         mockStorage.getItem.mockReturnValueOnce('invalid-json-{')

         const { result } = renderHook(() => useLocalStorage({ key: 'parse-error', initialValue: 'fallback' }))

         expect(result.current[0]).toBe('fallback')
         expect(consoleSpy).toHaveBeenCalled()

         consoleSpy.mockRestore()
      })

      it('should handle JSON.stringify errors gracefully', () => {
         const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

         const { result } = renderHook(() => useLocalStorage({ key: 'stringify-error', initialValue: 'initial' }))

         // Create circular reference
         const circularObj: any = { name: 'test' }
         circularObj.self = circularObj

         act(() => {
            result.current[1](circularObj)
         })

         expect(consoleSpy).toHaveBeenCalled()
         // State should remain unchanged due to error
         expect(result.current[0]).toBe('initial')

         consoleSpy.mockRestore()
      })

      it('should handle localStorage.setItem errors (quota exceeded)', () => {
         const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
         mockStorage.setItem.mockImplementationOnce(() => {
            throw new DOMException('QuotaExceededError')
         })

         const { result } = renderHook(() => useLocalStorage({ key: 'quota-error', initialValue: 'initial' }))

         act(() => {
            result.current[1]('new-value')
         })

         expect(consoleSpy).toHaveBeenCalled()
         consoleSpy.mockRestore()
      })

      it('should handle localStorage.getItem errors', () => {
         const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
         mockStorage.getItem.mockImplementationOnce(() => {
            throw new Error('Storage access denied')
         })

         const { result } = renderHook(() => useLocalStorage({ key: 'get-error', initialValue: 'fallback' }))

         expect(result.current[0]).toBe('fallback')
         expect(consoleSpy).toHaveBeenCalled()

         consoleSpy.mockRestore()
      })

      it('should handle null localStorage gracefully', () => {
         // Simulate environment where localStorage is null
         Object.defineProperty(window, 'localStorage', { value: null })

         const { result } = renderHook(() => useLocalStorage({ key: 'no-storage', initialValue: 'fallback' }))

         expect(result.current[0]).toBe('fallback')
      })
   })

   describe('Performance Tests', () => {
      it('should re-parse only when string value changes', () => {
         mockStorage._setStore({ 'string-change-test': '"value1"' })

         const { result } = renderHook(() => useLocalStorage({ key: 'string-change-test', initialValue: 'initial' }))

         expect(result.current[0]).toBe('value1')

         // Change the stored value
         mockStorage._setStore({ 'string-change-test': '"value2"' })

         // Trigger re-evaluation
         act(() => {
            mockEvents._triggerCustomEvent('string-change-test')
         })

         expect(result.current[0]).toBe('value2')
      })

      it('should handle rapid successive updates efficiently', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'rapid-test', initialValue: 0 }))

         // Perform many rapid updates
         act(() => {
            for (let i = 1; i <= 100; i++) {
               result.current[1](i)
            }
         })

         expect(result.current[0]).toBe(100)
         expect(mockStorage.setItem).toHaveBeenCalledTimes(100)
         expect(mockEvents.dispatchEvent).toHaveBeenCalledTimes(100)
      })
   })

   describe('🌐SSR Support Tests', () => {
      it('should work with server-side rendering (no localStorage)', () => {
         // Mock server environment
         const originalLocalStorage = window.localStorage
         // @ts-ignore
         delete window.localStorage

         const { result } = renderHook(() => useLocalStorage({ key: 'ssr-test', initialValue: 'server-value' }))

         expect(result.current[0]).toBe('server-value')

         // Restore localStorage
         window.localStorage = originalLocalStorage
      })

      it('should handle function-based initial values in SSR', () => {
         const originalLocalStorage = window.localStorage
         // @ts-ignore
         delete window.localStorage

         const initialFn = vi.fn(() => ({ ssr: true, data: 'test' }))
         const { result } = renderHook(() => useLocalStorage({ key: 'ssr-function-test', initialValue: initialFn }))

         expect(result.current[0]).toEqual({ ssr: true, data: 'test' })

         // Restore localStorage
         window.localStorage = originalLocalStorage
      })
   })

   describe('Edge Cases', () => {
      it('should handle empty string as a valid value', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'empty-string', initialValue: 'default' }))

         act(() => {
            result.current[1]('')
         })

         expect(result.current[0]).toBe('')
         expect(mockStorage.setItem).toHaveBeenCalledWith('empty-string', '""')
      })

      it('should handle very large objects', () => {
         const largeObj = {
            data: Array(1000)
               .fill(0)
               .map((_, i) => ({ id: i, value: `item-${i}` })),
         }

         const { result } = renderHook(() => useLocalStorage({ key: 'large-object', initialValue: null as any }))

         act(() => {
            result.current[1](largeObj)
         })

         expect(result.current[0]).toEqual(largeObj)
      })

      it('should handle special characters in keys', () => {
         const specialKey = 'test-key-with-special-chars-!@#$%^&*()'
         const { result } = renderHook(() => useLocalStorage({ key: specialKey, initialValue: 'special' }))

         act(() => {
            result.current[1]('updated')
         })

         expect(result.current[0]).toBe('updated')
         expect(mockStorage.setItem).toHaveBeenCalledWith(specialKey, '"updated"')
      })

      it('should handle Date objects', () => {
         const testDate = new Date('2023-01-01T00:00:00Z')
         const { result } = renderHook(() =>
            useLocalStorage({ key: 'date-test', initialValue: null as unknown as Date })
         )

         act(() => {
            result.current[1](testDate)
         })
         // Date
         expect(result.current[0]).toBe(testDate)
         expect(mockStorage.getItem('date-test')).toBe(JSON.stringify(testDate))
      })

      it('should handle nested objects with arrays', () => {
         const complexObj = {
            user: {
               name: 'John',
               preferences: {
                  theme: 'dark',
                  notifications: ['email', 'push'],
                  settings: {
                     autoSave: true,
                     shortcuts: { save: 'Ctrl+S', open: 'Ctrl+O' },
                  },
               },
            },
            metadata: {
               created: new Date().toISOString(),
               version: '1.0.0',
            },
         }

         const { result } = renderHook(() => useLocalStorage({ key: 'complex-nested', initialValue: {} }))

         act(() => {
            result.current[1](complexObj)
         })

         expect(result.current[0]).toEqual(complexObj)
      })

      it('should maintain referential integrity for objects', () => {
         const { result } = renderHook(() => useLocalStorage({ key: 'ref-test', initialValue: { items: [] as any[] } }))

         act(() => {
            result.current[1]((prev) => ({
               ...prev,
               items: [...prev.items, 'new-item'],
            }))
         })

         const state1 = result.current[0]

         act(() => {
            result.current[1]((prev) => ({
               ...prev,
               timestamp: Date.now(),
            }))
         })

         const state2 = result.current[0]

         expect(state1).not.toBe(state2) // Different object references
         expect(state2.items).toContain('new-item')
      })
   })

   describe('Multiple Instance Tests', () => {
      it('should allow multiple instances with different keys', () => {
         const { result: result1 } = renderHook(() => useLocalStorage({ key: 'instance-1', initialValue: 'value1' }))

         const { result: result2 } = renderHook(() => useLocalStorage({ key: 'instance-2', initialValue: 'value2' }))

         expect(result1.current[0]).toBe('value1')
         expect(result2.current[0]).toBe('value2')

         act(() => {
            result1.current[1]('updated1')
         })

         act(() => {
            result2.current[1]('updated2')
         })

         expect(result1.current[0]).toBe('updated1')
         expect(result2.current[0]).toBe('updated2')
      })

      it('should sync multiple instances with the same key', async () => {
         const { result: result1 } = renderHook(() => useLocalStorage({ key: 'shared-key', initialValue: 'initial' }))

         const { result: result2 } = renderHook(() => useLocalStorage({ key: 'shared-key', initialValue: 'initial' }))

         // Update from first instance
         act(() => {
            result1.current[1]('from-instance-1')
         })

         // Both should have the updated value
         expect(result1.current[0]).toBe('from-instance-1')

         // Second instance should update via event
         await waitFor(() => {
            expect(result2.current[0]).toBe('from-instance-1')
         })
      })
   })
})
