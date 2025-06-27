'use client'
import type { ReactNode } from 'react'

import { createContext, useContext } from 'react'
import useCanReachToInternet, { CanReachToInternetOptions } from '.'

/**
 * Type definition for the context values containing all return values from useCanReachToInternet hook
 */
type CtxValues = ReturnType<typeof useCanReachToInternet>

/**
 * React Context for sharing internet connectivity status across the component tree
 *
 * @description
 * This context provides all the connectivity status and control methods from
 * useCanReachToInternet hook to any component in the React component tree
 * without prop drilling.
 *
 */
const CanReachToInternetCtx = createContext<CtxValues>({} as CtxValues)

/**
 * Props interface for the CanReachToInternetCtxProvider component
 */
interface CanReachToInternetCtxProviderProps extends CanReachToInternetOptions {
   /** React children components that will have access to the connectivity context */
   children: ReactNode
}

/**
 * Context Provider component for internet connectivity monitoring
 *
 * @description
 * This provider component wraps your application or component tree to provide
 * internet connectivity status and controls to all child components. It uses
 * the useCanReachToInternet hook internally and shares its values through React Context.
 *
 * The provider accepts all the same configuration options as the useCanReachToInternet
 * hook, allowing you to configure network polling, test URLs, and polling intervals
 * at the application level.
 *
 *
 * @example
 * // Basic usage - wrap your app with the provider
   import { CanReachToInternetCtxProvider } from 'classic-react-hooks'
   
   function App() {
      return (
         <CanReachToInternetCtxProvider>
            <Header />
            <MainContent />
            <Footer />
         </CanReachToInternetCtxProvider>
      )
   }
 *
 * */
export function CanReachToInternetCtxProvider({ children, ...options }: CanReachToInternetCtxProviderProps) {
   const values = useCanReachToInternet(options)

   return <CanReachToInternetCtx.Provider value={values}>{children}</CanReachToInternetCtx.Provider>
}

/**
 * Custom hook to consume the internet connectivity context
 * 
 * @description
 * This hook provides access to all the internet connectivity status and control
 * methods from the nearest CanReachToInternetCtxProvider in the component tree.
 * It must be used within a component that is wrapped by CanReachToInternetCtxProvider,
 * otherwise it will throw an error.
 * 
 * The hook returns the same values as useCanReachToInternet, but accessed through
 * React Context instead of being created locally in each component.
 * 
 * @throws {Error} Throws an error if used outside of CanReachToInternetCtxProvider
 * 
 * @example
 * // Basic usage in a component
   import { useCanReachToInternetCtx } from 'classic-react-hooks'
   
   function NetworkStatusBadge() {
      const { isFullyConnected, isCheckingConnection } = useCanReachToInternetCtx()
      
      if (isCheckingConnection) {
         return <div className="badge checking">Checking...</div>
      }
      
      return (
         <div className={`badge ${isFullyConnected ? 'online' : 'offline'}`}>
            {isFullyConnected ? '🟢 Online' : '🔴 Offline'}
         </div>
      )
   }
 *
 * */
export function useCanReachToInternetCtx() {
   if (!CanReachToInternetCtx) {
      throw new Error('useCanReachToInternetCtx must be used within an CanReachToInternetCtxProvider')
   }
   return useContext(CanReachToInternetCtx)
}
