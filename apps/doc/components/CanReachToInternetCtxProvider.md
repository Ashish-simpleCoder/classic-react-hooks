---
outline: deep
---

# Internet Connectivity Context

A React Context provider and hook for sharing internet connectivity status across your component tree without prop drilling. Built on top of the `useCanReachToInternet` hook to provide centralized connectivity monitoring.

## Features

-  **Centralized connectivity state:** Share connectivity status across your entire app
-  **No prop drilling:** Access connectivity data from any component in the tree
-  **Same configuration options:** All `useCanReachToInternet` options available at provider level

## Components & Hooks

### CanReachToInternetCtxProvider

A context provider component that wraps your application to provide connectivity status to all child components.

#### Props

| Parameter              |    Type     | Required |     Default Value      | Description                                                                 |
| ---------------------- | :---------: | :------: | :--------------------: | --------------------------------------------------------------------------- |
| children               | `ReactNode` |    ✅    |           -            | React children components that will have access to the connectivity context |
| enableNetworkPolling   |  `boolean`  |    ❌    |         `true`         | Enable automatic network polling to continuously check connectivity         |
| networkPollingInterval |  `number`   |    ❌    |         `3000`         | Interval in milliseconds between network polls                              |
| testUrl                |  `string`   |    ❌    | `'https://dns.google'` | URL to test internet connectivity against                                   |

### useCanReachToInternetCtx

A custom hook to consume the internet connectivity context values.

#### Returns

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

### Network Status Badge Component

```tsx
import { useCanReachToInternetCtx } from 'classic-react-hooks'

function NetworkStatusBadge() {
   const { isFullyConnected, isCheckingConnection } = useCanReachToInternetCtx()

   if (isCheckingConnection) {
      return <div className='badge checking'>Checking...</div>
   }

   return (
      <div className={`badge ${isFullyConnected ? 'online' : 'offline'}`}>
         {isFullyConnected ? '🟢 Online' : '🔴 Offline'}
      </div>
   )
}
```

## Why Use Context Instead of Hook Directly?

### Benefits of Context Approach

-  **Single source of truth:** One connectivity state shared across the entire app
-  **Performance:** Only one network polling instance running instead of multiple
-  **Consistency:** All components see the same connectivity status simultaneously
-  **Centralized configuration:** Set polling intervals and test URLs once at the app level
-  **Reduced complexity:** No need to pass connectivity props down through component trees

### When to Use Each Approach

**Use Context when:**

-  Multiple components need connectivity status
-  You want centralized connectivity configuration
-  Building a larger application with complex component hierarchy
-  Need consistent connectivity state across the app

**Use Hook directly when:**

-  Only one or few components need connectivity status
-  Building simple components or libraries
-  Need different connectivity configurations for different parts of your app
-  Working with isolated features

## Important Notes

### Error Handling

The `useCanReachToInternetCtx` hook will throw an error if used outside of `CanReachToInternetCtxProvider`:

```tsx
// ❌ This will throw an error
function ComponentOutsideProvider() {
   const { isOnline } = useCanReachToInternetCtx() // Error!
   return <div>Status: {isOnline}</div>
}

// ✅ This works correctly
function App() {
   return (
      <CanReachToInternetCtxProvider>
         <ComponentInsideProvider />
      </CanReachToInternetCtxProvider>
   )
}

function ComponentInsideProvider() {
   const { isOnline } = useCanReachToInternetCtx() // Works!
   return <div>Status: {isOnline}</div>
}
```

### Performance Considerations

-  **Single polling instance:** Context ensures only one network polling operation runs, regardless of how many components consume the context
-  **Memory efficiency:** Automatic cleanup of network requests and timers when provider unmounts
-  **Battery optimization:** Configure appropriate polling intervals for mobile devices

### Best Practices

-  Place the provider as high as possible in your component tree for maximum availability
-  Use appropriate polling intervals based on your app's needs (longer intervals for battery-sensitive apps)
-  Consider conditional rendering for offline scenarios to improve user experience
-  Implement proper loading states using `isCheckingConnection` for better UX
