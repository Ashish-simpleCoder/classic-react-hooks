---
outline: deep
---

# use-window-resize

A React hook that evaluates provided callback function on window resize event and returns the result of it.

::: tip
Perfect for responsive behavior based on window dimensions.
:::

::: info
At it's core, [useEventListener](use-event-listener.html) hook is used internally for listening to resize event.
:::

## Features

-  **Custom handler:** Execute custom logic on window resize
-  **Reactive:** Automatic re-evaluation and state updates
-  **Configurable:** Configurable default values and event injection
-  **Performance:** It uses [useLayoutEffect](https://react.dev/reference/react/useLayoutEffect) hook for resize event listening

## Parameters

| Parameter |             Type             | Required | Default Value | Description                                 |
| --------- | :--------------------------: | :------: | :-----------: | ------------------------------------------- |
| handler   | [Handler](#type-definitions) |    ✅    |       -       | Callback function executed on window resize |
| options   | [Options](#type-definitions) |    ❌    |   undefined   | Configuration options                       |
|           |

### Options Parameter

| Property          | Type        | Default   | Description                                                                                                             |
| ----------------- | ----------- | --------- | ----------------------------------------------------------------------------------------------------------------------- |
| defaultValue      | Generic `T` | undefined | The initial value returned before the first resize event. If not provided, the `handler` is called immediately on mount |
| shouldInjectEvent | boolean     | true      | Controls whether the resize event listener should be attached. When `false`, the listener is not added                  |

### Type Definitions

::: details

```ts
type Handler<T> = () => T
type Options<T> = { shouldInjectEvent?: boolean; defaultValue?: T }
```

:::

## Return value(s)

Returns the evaluated result of the `handler` function call on resize event.

| Return Value                      | Type        | Description                |
| --------------------------------- | ----------- | -------------------------- |
| Result of `handler` function call | Generic `T` | Result to use in component |

## Common Use Cases

-  Creating dynamic layouts
-  Toggling element visibility based on window dimension
-  Dynamically lazy loading components for mobile and desktop screens

## Usage Examples

### Basic Responsive Breakpoints

```ts {4-10,15-17}
import { useWindowResize } from 'classic-react-hooks'

function ResponsiveComponent() {
   const breakpoint = useWindowResize(() => {
      const width = window.innerWidth
      if (width < 640) return 'sm'
      if (width < 768) return 'md'
      if (width < 1024) return 'lg'
      return 'xl'
   })

   return (
      <div>
         <h1>Current breakpoint: {breakpoint}</h1>
         {breakpoint === 'sm' && <MobileLayout />}
         {breakpoint === 'md' && <TabletLayout />}
         {['lg', 'xl'].includes(breakpoint) && <DesktopLayout />}
      </div>
   )
}
```

### With Default Value

:::details Example

```ts
import { useWindowResize } from 'classic-react-hooks'

function ComponentWithDefault() {
   const isMobile = useWindowResize(() => window.innerWidth < 768, {
      defaultValue: false, // Assume desktop by default          // [!code ++]
      shouldInjectEvent: false,
   })

   return <nav className={isMobile ? 'mobile-nav' : 'desktop-nav'}>{/* Navigation content */}</nav>
}
```

:::

## Advanced Usage

### Debounced Resize Handler

::: details Example

```ts {7-10}
import { useMemo } from 'react'
import { useWindowResize, useDebouncedFn } from 'classic-react-hooks'

function ExpensiveCalculation() {
   const expensiveHandler = useDebouncedFn(
      () =>
         debounce(() => {
            // Expensive calculation here
            return performComplexCalculation()
         }),
      250
   )

   const result = useWindowResize(expensiveHandler)

   return <div>{result}</div>
}
```

:::
