---
outline: deep
---

# use-can-reach-to-internet

A comprehensive React hook for monitoring internet connectivity status that goes beyond basic online/offline detection by actually testing network reachability.

## Features

-  **Real connectivity testing:** Performs actual HTTP requests to verify internet access
-  **Dual-layer detection:** Combines browser's `navigator.onLine` with network reachability tests
-  **Automatic monitoring:** Configurable polling intervals for continuous connectivity monitoring
-  **Manual control:** Start/stop polling and force connectivity checks on demand
-  **Cleanup handling:** Proper cleanup of network requests and timers to prevent memory leaks

## Parameters

| Parameter |                Type                 | Required | Default Value | Description                                        |
| --------- | :---------------------------------: | :------: | :-----------: | -------------------------------------------------- |
| options   | [CanReachToInternetOptions](#types) |    ❌    |      {}       | Configuration object for customizing hook behavior |

### Parameter Types

```ts
type CanReachToInternetOptions = {
   /** Enable automatic network polling to continuously check connectivity */
   enableNetworkPolling?: boolean
   /** Interval in milliseconds between network polls */
   networkPollingInterval?: number
   /** URL to test internet connectivity against */
   testUrl?: string
}

type CanReachToInternetBoolean = boolean
```

## Returns

| Property                      | Type            | Description                                                                      |
| ----------------------------- | --------------- | -------------------------------------------------------------------------------- |
| `isOnline`                    | `boolean`       | Browser's native online/offline status from `navigator.onLine`                   |
| `canReachToInternet`          | `boolean`       | Whether the device can actually reach the internet (verified via HTTP request)   |
| `isFullyConnected`            | `boolean`       | Combined status: `true` when both `isOnline` and `canReachToInternet` are `true` |
| `isNetworkPollingEnabled`     | `boolean`       | Current state of automatic network polling                                       |
| `isCheckingConnection`        | `boolean`       | Whether a connectivity check is currently in progress                            |
| `startNetworkPolling`         | `() => void`    | Function to start automatic network polling                                      |
| `stopNetworkPolling`          | `() => void`    | Function to stop automatic network polling                                       |
| `forceCheckNetwork`           | `() => void`    | Function to manually trigger a connectivity check                                |
| `getCanReachToInternetStatus` | `() => boolean` | Function to get current internet reachability status                             |

## Usage Examples

### Basic Network query

```ts
import { useCanReachToInternet } from 'classic-react-hooks'

function NetworkStatus() {
   const { isOnline, canReachToInternet, isFullyConnected } = useCanReachToInternet()

   return (
      <div>
         <p>Browser Online: {isOnline ? '✅' : '❌'}</p>
         <p>Internet Reachable: {canReachToInternet ? '✅' : '❌'}</p>
         <p>Fully Connected: {isFullyConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      </div>
   )
}
```

### Conditional Rendering Based on Connectivity

```ts
import { useCanReachToInternet } from 'classic-react-hooks'

function DataFetchingComponent() {
   const { isFullyConnected, isCheckingConnection } = useCanReachToInternet()

   if (isCheckingConnection) {
      return <div>Checking connection...</div>
   }

   if (!isFullyConnected) {
      return (
         <div className='text-center p-4'>
            <h3>No Internet Connection</h3>
            <p>Please check your connection and try again.</p>
         </div>
      )
   }

   return <YourDataComponent />
}
```

## Problem It Solves

### The Problem with `navigator.onLine`

`navigator.onLine` only tells you if the browser thinks it's connected to a network, not if it can actually reach the internet.

#### Common Scenarios Where `navigator.onLine` Fails

-  **Limited Connectivity:** Your device is connected to a router, but the router has no internet connection. The browser sees the local network connection and reports online status as true.
-  **Network Issues:** DNS problems or ISP outages where you have network connection but can't reach to external servers.
-  **Captive Portals:** You're connected to WiFi at a hotel, airport but haven't authenticated yet. `navigator.onLine` returns true, but you can't access any websites.

---

### How `useCanReachToInternet` solve these problems

It provides two layers of connectivity detection

-  **`isOnline`:** Browser's basic network status (via `navigator.onLine`)
-  **`canReachToInternet`:** Actual internet reachability (via real HTTP requests to a test server)
-  **`isFullyConnected`:** Both conditions must be true for genuine internet access

## Common Use Cases

-  User experience: Show connection status, disable features when offline
-  Error handling: Distinguish between network errors and server errors
-  Auto-retry logic: Retry failed requests when connectivity is restored

## Important Notes

-  Performance Considerations:
   -  Network polling makes regular HTTP requests - use appropriate intervals
   -  Consider battery usage on mobile devices with frequent polling
   -  The hook automatically cleans up requests to prevent memory leaks
-  CORS Limitations:
   -  Uses `mode: 'no-cors'` for broader compatibility
   -  Some URLs might not work due to CORS policies
   -  Default test URL `(https://dns.google)` is chosen for reliability
