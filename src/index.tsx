import * as React from 'react'

export { useEventListener as useEventListener } from './lib/use-event-listener'
export { default as useWindowResize } from './lib/use-window-resize'
export { default as useOutsideClick } from './lib/use-outside-click'

export { default as useCopyToClipboard, copyToClipboardFn } from './lib/use-copy-to-clipboard'
export { default as useLocalStorage } from './lib/use-local-storage'

export { default as useDebouncedFn, debouncedFnWrapper } from './lib/use-debounced-fn'
export { default as useThrottledFn, throttledFnWrapper } from './lib/use-throttled-fn'

export { default as useCanReachToInternet } from './lib/use-can-reach-to-internet'
export {
   useCanReachToInternetCtx,
   CanReachToInternetCtxProvider as CanReachToInternetProvider,
} from './lib/use-can-reach-to-internet/can-reach-to-internet-context'

export { default as useSyncedRef } from './lib/use-synced-ref'

export { default as useTimeoutEffect } from './lib/use-timeout-effect'
export { default as useIntervalEffect } from './lib/use-interval-effect'
export { default as useSyncedEffect } from './lib/use-synced-effect'
export { default as useOnMountEffect } from './lib/use-on-mount-effect'

export { default as useCounter } from './lib/use-counter'

export { default as useInterSectionObserver } from './lib/use-intersection-observer'
export { default as useMultipleIntersectionObserver } from './lib/use-multi-intersection-observer'
