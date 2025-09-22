---
'classic-react-hooks': minor
---


## Fixes following issues
- Fix: use-can-reach-to-internet `subscribe` handler for `useSyncExternalStore`. It was adding events instead of removing.
- Fix: Prevent from re-triggering the call of `checkIfCanReachToInternet` function in useEffect when `isNetworkPollingEnabled` is disabled.

## Test cases 
- Wrote test cases for use-can-reach-to-internet and use-copy-to-clipboard hook. Previously not written.

