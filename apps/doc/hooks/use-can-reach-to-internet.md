---
outline: deep
---

# use-can-reach-to-internet

_`use-can-reach-to-internet`_ is a comprehensive React hook for accurately detecting real internet connectivity, not just network presence.

It combines the browser’s native navigator.onLine signal with active HTTP reachability checks to determine whether external internet access is actually available. The hook supports automatic polling as well as manual, on-demand connectivity checks, giving you full control over monitoring behavior.

Its ref-safe, cleanup-aware design prevents memory leaks by properly managing timers and in-flight requests. This makes it well-suited for connectivity-aware UIs, retry logic, and robust offline/online handling.

## Features

-  **Real connectivity testing:** Verifies internet access using actual HTTP requests
-  **Dual-layer detection:** Combines `navigator.onLine` with reachability checks for accurate results
-  **Comprehensive status flags:** Exposes `isOnline`, `canReachToInternet`, and `isFullyConnected`
-  **Automatic monitoring:** Configurable polling interval for continuous connectivity tracking
-  **Manual control:** Start, stop, or force connectivity checks programmatically
-  **Cleanup-safe design:** Automatically cleans up timers and network requests to prevent leaks

## Problem It Solves

::: details The Problem with `navigator.onLine`

---

**Problem:-** `navigator.onLine` only tells you if the browser thinks it's connected to a network, not if it can actually reach the internet.

Common Scenarios Where `navigator.onLine` Fails

-  **Limited Connectivity:** Your device is connected to a router, but the router has no internet connection. The browser sees the local network connection and reports online status as true.
-  **Network Issues:** DNS problems or ISP outages where you have network connection but can't reach to external servers.
-  **Captive Portals:** You're connected to WiFi at a hotel, airport but haven't authenticated yet. `navigator.onLine` returns true, but you can't access any websites.

---

**Solution:-** How `useCanReachToInternet` solve these problems

It provides two layers of connectivity detection

-  **`isOnline`:** Browser's basic network status (via `navigator.onLine`)
-  **`canReachToInternet`:** Actual internet reachability (via real HTTP requests to a test server)
-  **`isFullyConnected`:** Both conditions must be true for genuine internet access
   :::

## Important Notes

::: danger Important

-  Performance Considerations:
   -  Network polling makes regular HTTP requests - use appropriate intervals
   -  Consider battery usage on mobile devices with frequent polling
   -  The hook automatically cleans up requests to prevent memory leaks
-  CORS Limitations:
   -  Uses `mode: 'no-cors'` for broader compatibility
   -  Default test URL `(https://dns.google)` is chosen for reliability

:::

## Parameters

| Parameter |                      Type                      | Required | Default Value | Description                                        |
| --------- | :--------------------------------------------: | :------: | :-----------: | -------------------------------------------------- |
| options   | [CanReachToInternetOptions](#type-definitions) |    ❌    |      {}       | Configuration object for customizing hook behavior |

### Options Parameter

| Property               | Type    | Default             | Description                                                                                                       |
| ---------------------- | ------- | ------------------- | ----------------------------------------------------------------------------------------------------------------- |
| enableNetworkPolling   | boolean | true                | Controls whether the hook should automatically and continuously check internet connectivity at regular intervals. |
| networkPollingInterval | number  | 3000                | Specifies the interval in milliseconds for polling.                                                               |
| testUrl                | string  | https://dns.google' | The URL endpoint used to test actual internet connectivity with HEAD method.                                      |

### Type Definitions

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

## Return value(s)

This hook provides full list of status flags and callbacks for internet reachability tracking

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

## Common Use Cases

-  **Real Internet stats:** Show connection status, disable features when offline
-  **Error handling:** Distinguish between network errors and server errors
-  **Auto-retry logic:** Retry failed requests when connectivity is restored

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

::: details Example

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

:::
