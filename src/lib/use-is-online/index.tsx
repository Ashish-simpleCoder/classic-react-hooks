'use client'
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState, useSyncExternalStore } from 'react'

type CanReachToInternetBoolean = boolean
type CanReachToInternetOptions = {
   enableNetworkPolling?: boolean
   networkPollingInterval?: number
}

/**
 * @description
 * A simple hook for getting the network connection state.
 *
 * @see Docs https://classic-react-hooks.vercel.app/hooks/use-is-online.html
 */
export default function useCanReachToInternet(
   options: CanReachToInternetOptions = {
      enableNetworkPolling: true,
      networkPollingInterval: 5000,
   }
) {
   const [canReachToInternet, setCanReachToInternet] = useState(false)
   const isOnline = useSyncExternalStore(subscribe, getSnapshot, () => true)

   const states = useRef<{
      abortControllerRef: AbortController | undefined
      timeoutId: NodeJS.Timeout | undefined
      checkIfCanReachToInternet: () => Promise<void>
      stopNetworkPolling: () => void
      restartNetworkPolling: () => void
   }>({
      abortControllerRef: undefined,
      timeoutId: undefined,
      stopNetworkPolling: () => {
         clearTimeout(states.current.timeoutId)
         states.current.abortControllerRef?.abort()
      },
      restartNetworkPolling: () => {
         states.current.checkIfCanReachToInternet()
      },
      checkIfCanReachToInternet: async () => {
         try {
            // ping to Google dns server to check if really connected to internet
            // https://8.8.8.8  google-dns
            await fetch('https://dns.google', {
               method: 'HEAD',
               cache: 'no-cache',
               mode: 'no-cors',
               headers: {
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  Pragma: 'no-cache',
               },
               signal: states.current.abortControllerRef?.signal,
            })
            setCanReachToInternet(true)
         } catch (err) {
            setCanReachToInternet(false)
         } finally {
            if (options.enableNetworkPolling) {
               setTimeout(() => states.current.checkIfCanReachToInternet(), options.networkPollingInterval)
            }
         }
      },
   })
   useEffect(() => {
      if (!isOnline) {
         setCanReachToInternet(false)
      } else {
         states.current.checkIfCanReachToInternet()
      }

      return () => {
         clearTimeout(states.current.timeoutId)
         states.current.abortControllerRef?.abort()
      }
   }, [isOnline])

   return {
      isOnline: canReachToInternet,
      stopNetworkPolling: states.current.stopNetworkPolling,
      restartNetworkPolling: states.current.restartNetworkPolling,
   }
}

function subscribe(callback: () => void) {
   window.addEventListener('online', callback)
   window.addEventListener('offline', callback)

   return () => {
      window.addEventListener('online', callback)
      window.addEventListener('offline', callback)
   }
}
const getSnapshot = () => navigator.onLine

type CtxValues = ReturnType<typeof useCanReachToInternet>

const CanReachToCtx = createContext<CtxValues>({} as CtxValues)

function useIsOnlineValue() {
   const { isOnline } = useContext(CanReachToCtx)
   return isOnline
}

function CanReachToInternetProvider(props: CanReachToInternetOptions & { children: ReactNode }) {
   const values = useCanReachToInternet(props)

   return <CanReachToCtx.Provider value={values}>{props.children}</CanReachToCtx.Provider>
}
