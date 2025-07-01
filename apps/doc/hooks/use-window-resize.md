---
outline: deep
---

# use-window-resize

A React hook that evaluates a callback function on window resize events and returns the result.

Perfect for responsive behavior based on window dimensions.

### Features

-  **Custom handler:** Execute custom logic on window resize
-  **Reactive:** Automatic re-evaluation and state updates
-  **Configurable:** Configurable default values and event injection
-  **Underlying hook:** At its core, it uses `useEventListener` hook

### Parameters

| Parameter |       Type        | Required | Default Value | Description                                 |
| --------- | :---------------: | :------: | :-----------: | ------------------------------------------- |
| handler   | [Handler](#types) |    ✅    |       -       | Callback function executed on window resize |
| options   | [Options](#types) |    ❌    |   undefined   | Configuration options                       |
|           |

#### Types

```ts
type Handler<T> = () => T
type Options<T> = { shouldInjectEvent?: boolean; defaultValue?: T }
```

### Returns

-  Returns the current result of the `handler` function, updated whenever the window is resized.

### Usage Examples

#### Basic Responsive Breakpoints

```ts
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

#### Window Dimensions Tracking

```ts
import { useWindowResize } from 'classic-react-hooks'

function WindowDimensions() {
   const dimensions = useWindowResize(() => ({
      width: window.innerWidth,
      height: window.innerHeight,
      aspectRatio: window.innerWidth / window.innerHeight,
   }))

   return (
      <div>
         <p>Width: {dimensions.width}px</p>
         <p>Height: {dimensions.height}px</p>
         <p>Aspect Ratio: {dimensions.aspectRatio.toFixed(2)}</p>
      </div>
   )
}
```

#### With Default Value

```ts
import { useWindowResize } from 'classic-react-hooks'

function ComponentWithDefault() {
   const isMobile = useWindowResize(() => window.innerWidth < 768, {
      defaultValue: false, // Assume desktop by default
      shouldInjectEvent: false,
   })

   return <nav className={isMobile ? 'mobile-nav' : 'desktop-nav'}>{/* Navigation content */}</nav>
}
```

### Advanced Usage

#### Debounced Resize Handler

```ts
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

### Important Notes

-  Initial value is determined by either `defaultValue` or calling `handler()` immediately.

### Common Use Cases

-  Creating dynamic layouts
-  Toggling element visibility based on window dimension
-  Dynamically lazy loading components for mobile and desktop screens
