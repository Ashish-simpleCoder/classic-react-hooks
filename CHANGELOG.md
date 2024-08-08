# classic-react-hooks

## 1.4.0

### Minor Changes

-  b11719a: Add use-window-resize hook

## 1.3.0

### Minor Changes

-  b8fe2f5: Release use-intersection-observer hook

## 1.2.1

### Patch Changes

-  81739cb: Upgrade development dependencies

   -  [50bd2d9] build: update dependencies version
   -  [e2495cb] dep: update vite dependency and rename vite config to latest version

## 1.2.0

### Minor Changes

-  39f9f42: Add timer cleanup on unmount in use-debounced-fn

   -  fix #57: Callback is triggered after unmount for use-debounced-fn hook
   -  Add tests for timer cleanup and params syncing in use-debounced-fn hook

## 1.1.0

### Minor Changes

-  0da1450: Fix doc issue and add new hook called use-throttled-hook

   -  [279903f] docs: fix link typo of use-debounced-fn text
   -  [def0a44] docs: docs: add doc for use-throttled-fn hook
   -  [86bcb01] test: add test cases for use-throttled-fn hook
   -  [5a4f1d8] feat: add use-throttled-fn hook
   -  [75d88f4] style: update prettierignore config

## 1.0.0

### Major Changes

-  72681e1: Major release

### Minor Changes

-  4a00db0: Docs and some refactor for logic

   -  [c1db97d] docs: remove doc template files
   -  [d3cdff6] feat: create new copy-to-clipboard function in use-copy-to-clipboard
   -  [44179bd] test: add test case to handle defaultValue in catch block in use-local-storage
   -  [d8d5b41] fix: parse logic in use-local-storage

-  8931f18: - Add use-client directive support
   -  Turn off cleanUrl config in vitepress doc
   -  Update test cases for `use-event-listener` hook
-  a14cd39: Add initialValue param for use-counter hook
-  a370a03: Update documentation and test cases

   -  [f7c5939] docs: update overview
   -  [3e06140] docs: update use-event-listener doc
   -  [0a8ef61] docs: update js-doc for all of the hooks
   -  [bb05733] remove: useCallback from hooks
   -  [a8f50f6] test: add extra test case for use-outside-click for covering the branch

-  20c59ec: Update docs and fix logic issues in hooks
-  4709360: - doc: update description for delay in use-debounced-fn
   -  doc: update use-outside-click hook doc for new option param
   -  feat: add Options param in use-outside-click hook
   -  doc: remove return type from use-event-listener doc
   -  type: export use-event-listener params types
-  7e65ed2: - Add refs support in use-event-listener
   -  Update doc for use-event-listener
   -  Add new test case for testing refs in use-event-listener
-  034f910: Fix working with ref for use-outside-click hook

### Patch Changes

-  b21e739: Fix missing utility type Prettify in build
-  6fff795: first beta release

## 1.0.0-beta.10

### Minor Changes

-  4a00db0: Docs and some refactor for logic

   -  [c1db97d] docs: remove doc template files
   -  [d3cdff6] feat: create new copy-to-clipboard function in use-copy-to-clipboard
   -  [44179bd] test: add test case to handle defaultValue in catch block in use-local-storage
   -  [d8d5b41] fix: parse logic in use-local-storage

## 1.0.0-beta.9

### Minor Changes

-  a14cd39: Add initialValue param for use-counter hook

## 1.0.0-beta.8

### Minor Changes

-  a370a03: Update documentation and test cases

   -  [f7c5939] docs: update overview
   -  [3e06140] docs: update use-event-listener doc
   -  [0a8ef61] docs: update js-doc for all of the hooks
   -  [bb05733] remove: useCallback from hooks
   -  [a8f50f6] test: add extra test case for use-outside-click for covering the branch

## 1.0.0-beta.7

### Minor Changes

-  4709360: - doc: update description for delay in use-debounced-fn
   -  doc: update use-outside-click hook doc for new option param
   -  feat: add Options param in use-outside-click hook
   -  doc: remove return type from use-event-listener doc
   -  type: export use-event-listener params types

## 1.0.0-beta.6

### Minor Changes

-  034f910: Fix working with ref for use-outside-click hook

## 1.0.0-beta.5

### Patch Changes

-  b21e739: Fix missing utility type Prettify in build

## 1.0.0-beta.4

### Major Changes

-  72681e1: Major release

## 0.2.0-beta.3

### Minor Changes

-  20c59ec: Update docs and fix logic issues in hooks

## 0.2.0-beta.2

### Minor Changes

-  8931f18: - Add use-client directive support
   -  Turn off cleanUrl config in vitepress doc
   -  Update test cases for `use-event-listener` hook

## 0.2.0-beta.1

### Minor Changes

-  7e65ed2: - Add refs support in use-event-listener
   -  Update doc for use-event-listener
   -  Add new test case for testing refs in use-event-listener

## 0.1.1-beta.0

### Patch Changes

-  first beta release
