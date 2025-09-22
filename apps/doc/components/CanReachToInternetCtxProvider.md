---
outline: deep
---

# Internet Connectivity Context

A React Context provider and hook for sharing internet connectivity status across your component tree without prop drilling.

Built on top of the [useCanReachToInternet](/hooks/use-can-reach-to-internet.html) hook to provide centralized connectivity monitoring.

## Features

-  **Centralized connectivity state:** Share connectivity status across your entire app
-  **No prop drilling:** Access connectivity data from any component in the tree
-  **Same configuration options:** All `useCanReachToInternet` options available at provider level

## Components & Hooks

### CanReachToInternetCtxProvider

A context provider component that wraps your application to provide connectivity status to all child components.

It takes following props

| Parameter              |   Type    | Required |   Default Value    | Description                                                                 |
| ---------------------- | :-------: | :------: | :----------------: | --------------------------------------------------------------------------- |
| children               | ReactNode |    ✅    |         -          | React children components that will have access to the connectivity context |
| enableNetworkPolling   |  boolean  |    ❌    |        true        | Enable automatic network polling to continuously check connectivity         |
| networkPollingInterval |  number   |    ❌    |        3000        | Interval in milliseconds between network polls                              |
| testUrl                |  string   |    ❌    | https://dns.google | URL to test internet connectivity against                                   |

### useCanReachToInternetCtx

A custom hook to consume the internet connectivity context values.

Return value(s):

| Property                    | Type          | Description                                                                      |
| --------------------------- | ------------- | -------------------------------------------------------------------------------- |
| isOnline                    | boolean       | Browser's native online/offline status from `navigator.onLine`                   |
| canReachToInternet          | boolean       | Whether the device can actually reach the internet (verified via HTTP request)   |
| isFullyConnected            | boolean       | Combined status: `true` when both `isOnline` and `canReachToInternet` are `true` |
| isNetworkPollingEnabled     | boolean       | Current state of automatic network polling                                       |
| isCheckingConnection        | boolean       | Whether a connectivity check is currently in progress                            |
| startNetworkPolling         | () => void    | Function to start automatic network polling                                      |
| stopNetworkPolling          | () => void    | Function to stop automatic network polling                                       |
| forceCheckNetwork           | () => void    | Function to manually trigger a connectivity check                                |
| getCanReachToInternetStatus | () => boolean | Function to get current internet reachability status                             |

## Usage Examples

### Basic App Setup

```tsx
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
```

### Custom Configuration

::: details Example

```tsx
import { CanReachToInternetCtxProvider } from 'classic-react-hooks'

function App() {
   return (
      <CanReachToInternetCtxProvider
         enableNetworkPolling={true}
         networkPollingInterval={5000}
         testUrl='https://httpbin.org/get'
      >
         <Header />
         <MainContent />
         <Footer />
      </CanReachToInternetCtxProvider>
   )
}
```

:::
