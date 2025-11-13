import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import useSyncedRef from '../use-synced-ref'

export type CanReachToInternetOptions = {
   /** Enable automatic network polling to continuously check connectivity */
   enableNetworkPolling?: boolean
   /** Interval in milliseconds between network polls */
   networkPollingInterval?: number
   /** URL to test internet connectivity against */
   testUrl?: string
}
export type CanReachToInternetBoolean = boolean

const DEFAULT_OPTIONS: Required<CanReachToInternetOptions> = {
   enableNetworkPolling: true,
   networkPollingInterval: 3000,
   testUrl: 'https://dns.google', // https://8.8.8.8
}

/**
 * @description
 * A comprehensive React hook for monitoring internet connectivity status that goes beyond basic online/offline detection by actually testing network reachability.

 * @example
 * import { useCanReachToInternet } from 'classic-react-hooks'
 *
 * function ConnectivityStatus() {
      const {
         isOnline,
         canReachToInternet,
         isFullyConnected,
         isCheckingConnection,
         isNetworkPollingEnabled,
         startNetworkPolling,
         stopNetworkPolling,
         forceCheckNetwork
      } = useCanReachToInternet()

      return (
         <div className="p-4 border rounded-lg">
         <h3 className="font-semibold mb-2">Connectivity Status</h3>

         <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
               <span>Browser Online: {isOnline ? 'Yes' : 'No'}</span>
            </div>

            <div className="flex items-center gap-2">
               <span className={`w-3 h-3 rounded-full ${canReachToInternet ? 'bg-green-500' : 'bg-red-500'}`} />
               <span>Internet Reachable: {canReachToInternet ? 'Yes' : 'No'}</span>
            </div>

            <div className="flex items-center gap-2">
               <span className={`w-3 h-3 rounded-full ${isFullyConnected ? 'bg-green-500' : 'bg-red-500'}`} />
               <span>Fully Connected: {isFullyConnected ? 'Yes' : 'No'}</span>
            </div>

            {isCheckingConnection && (
               <div className="text-sm text-gray-600">Checking connectivity...</div>
            )}
         </div>

         <div className="mt-4 space-x-2">
            <button
               onClick={forceCheckNetwork}
               className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
               Check Now
            </button>

            {isNetworkPollingEnabled ? (
               <button
               onClick={stopNetworkPolling}
               className="px-3 py-1 bg-red-500 text-white rounded text-sm"
               >
               Stop Polling
               </button>
            ) : (
               <button
               onClick={startNetworkPolling}
               className="px-3 py-1 bg-green-500 text-white rounded text-sm"
               >
               Start Polling
               </button>
            )}
         </div>
         </div>
      )
   }
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-can-reach-to-internet.html
 */
export default function useCanReachToInternet(options: CanReachToInternetOptions = {}) {
   const config = { ...DEFAULT_OPTIONS, ...options }

   // Getting browser's online/offline status
   const isOnline = useSyncExternalStore(subscribe, getSnapshot, () => true)

   const [canReachToInternet, setCanReachToInternet] = useState(false)
   const [isNetworkPollingEnabled, setIsNetworkPollingEnabled] = useState(config.enableNetworkPolling)
   const [isCheckingConnection, setIsCheckingConnection] = useState(false)
   const canReachToInternetRef = useSyncedRef(canReachToInternet)
   let isInitialCallDone = useRef(false)

   // Use refs to track cleanup and prevent memory leaks
   const abortControllerRef = useRef<AbortController | null>(null)
   const timeoutRef = useRef<NodeJS.Timeout | null>(null)

   const handlers = useRef({
      clearPendingOperations: () => {
         if (abortControllerRef.current) {
            abortControllerRef.current.abort('cleanup')
            abortControllerRef.current = null
         }
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
         }
      },
      stopNetworkPolling: () => setIsNetworkPollingEnabled(false),
      startNetworkPolling: () => setIsNetworkPollingEnabled(true),
      getCanReachToInternetStatus: () => canReachToInternetRef.current as CanReachToInternetBoolean,
   })

   /**
    * Performs an actual network request to test internet connectivity
    *
    * @description
    * This function makes a HEAD request to the configured test URL to verify
    * that the device can actually reach the internet, not just that the browser
    * thinks it's online.
    *
    */
   const checkIfCanReachToInternet = async () => {
      // If offline then early return with flag update
      if (!isOnline) {
         setCanReachToInternet(false)
         return
      }

      // Clear any existing operations
      handlers.current.clearPendingOperations()

      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setIsCheckingConnection(true)

      try {
         // ping to dns server to check if really connected to internet
         await fetch(config.testUrl, {
            method: 'HEAD',
            cache: 'no-cache',
            mode: 'no-cors',
            headers: {
               'Cache-Control': 'no-cache, no-store, must-revalidate',
               Pragma: 'no-cache',
            },
            signal: abortController.signal,
         })
         setCanReachToInternet(true)
      } catch (err) {
         // Only update state if the request wasn't aborted
         if (!abortController.signal.aborted) {
            setCanReachToInternet(false)
         }
      } finally {
         if (isNetworkPollingEnabled && !abortController.signal.aborted) {
            timeoutRef.current = setTimeout(() => checkIfCanReachToInternet(), config.networkPollingInterval)
         }
         setIsCheckingConnection(false)
      }
   }

   useEffect(() => {
      // If network polling is stopped, then do not run again.
      // Initially trigger checker function
      if (isInitialCallDone.current && !isNetworkPollingEnabled) {
         return
      }
      isInitialCallDone.current = true
      checkIfCanReachToInternet()

      return handlers.current.clearPendingOperations
   }, [isOnline, isNetworkPollingEnabled, config.networkPollingInterval])

   return {
      isOnline,
      canReachToInternet,
      isFullyConnected: isOnline && canReachToInternet,
      isNetworkPollingEnabled,
      isCheckingConnection,
      stopNetworkPolling: handlers.current.stopNetworkPolling,
      startNetworkPolling: handlers.current.startNetworkPolling,
      getCanReachToInternetStatus: handlers.current.getCanReachToInternetStatus,
      forceCheckNetwork: checkIfCanReachToInternet,
   }
}

// Handler to listen "online" and "offline" events
function subscribe(callback: () => void) {
   window.addEventListener('online', callback)
   window.addEventListener('offline', callback)

   return () => {
      window.removeEventListener('online', callback)
      window.removeEventListener('offline', callback)
   }
}
// getting network connection status
const getSnapshot = () => navigator.onLine
