---
outline: deep
---

# use-is-online

A React hook that provides real-time network connection status using the browser's `navigator.onLine` API.

### Features

-  **Real-time updates:** Real-time network status updates
-  **SSR safe:** SSR-safe with proper hydration handling
-  **Lightweight:** Lightweight with no external dependencies
-  **Core hook:** Built on React's useSyncExternalStore for optimal performance

### Returns

-  `isOnline (boolean):` Current network connection state

   -  `true` when the browser is online
   -  `false` when the browser is offline

### Usage Examples

#### Basic Network query

```ts
import { useIsOnline } from 'classic-react-hooks'

function NetworkStatus() {
   const isOnline = useIsOnline()

   return <div>Connection: {isOnline ? '🟢 Online' : '🔴 Offline'}</div>
}
```

### Important Notes
