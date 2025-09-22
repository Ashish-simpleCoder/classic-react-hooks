---
'classic-react-hooks': minor
---

## Fixes following issues
- Fix: use-can-reach-to-internet `subscribe` handler for `useSyncExternalStore`. It was adding events instead of removing.
- Fix: Prevent from re-triggering the call of `checkIfCanReachToInternet` function in useEffect when `isNetworkPollingEnabled` is disabled.

## Test cases 
- Wrote test cases for use-can-reach-to-internet and use-copy-to-clipboard hook. Previously not written.

## Major Rewrite for the Documentation
- home page and overview
- use-can-reach-to-internet
- use-copy-to-clipboard
- use-counter
- use-debounced-fn
- use-event-listener
- use-intersection-observer
- use-multi-intersection-observer
- use-interval-effect
- use-on-mount-effect
- use-outside-effect
- use-synced-effect
- use-synced-ref
- use-throttled-fn
- use-timeout-effect
- use-window-resize
