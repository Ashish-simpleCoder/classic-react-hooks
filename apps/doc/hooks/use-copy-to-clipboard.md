---
outline: deep
---

# use-copy-to-clipboard

A React hook that provides simple and reliable way to copy text to the clipboard with success and error handling callbacks.

## Features

-  **Clipboard API Support:** Uses the modern [navigator.clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) API for secure clipboard access
-  **Fallback Handling:** Gracefully handles cases where clipboard API is not available
-  **Success/Error Callbacks:** Built-in success and error handling with customizable callbacks
-  **Flexible Configuration:** Configure global callbacks via props or override per-call
-  **Performance Optimized:** Zero re-renders - purely ref-based

## Parameters

| Parameter |              Type              | Required | Default Value | Description                       |
| --------- | :----------------------------: | :------: | :-----------: | --------------------------------- |
| onSuccess | [OnSuccess](#type-definitions) |    ❌    |       -       | Default success callback function |
| onError   |  [OnError](#type-definitions)  |    ❌    |       -       | Default error callback function   |

::: warning
Any occured errors during operation are passed to the `onError` callback with descriptive error messages.
:::

### Type Definitions

```ts
type OnSuccess = () => void
type OnError = (err: Error) => void
```

## Return Value(s)

The hook returns a function which will copy the provided data into the clipboard

| Return Value               | Type                | Description                        |
| -------------------------- | ------------------- | ---------------------------------- |
| `copyToClipboard` function | `CopyToClipboardFn` | Handler function to copy text data |

### Type Definitions

```ts
type CopyToClipboardFn = (data: string, onSuccess?: OnSuccess, onError?: OnError) => Promise<void>
```

## Common Use Cases

-  Copy text data programatically

## Usage Examples

### Basic usage

```ts {7-15}
import { useState } from 'react'
import { useCopyToClipboard } from 'classic-react-hooks'

export default function CopyButton() {
   const [copied, setCopied] = useState(false)

   const copyToClipboard = useCopyToClipboard({
      onSuccess: () => {
         setCopied(true)
         setTimeout(() => setCopied(false), 2000)
      },
      onError: (error) => {
         console.error('Failed to copy:', error)
      },
   })

   const handleCopy = () => {
      copyToClipboard('Hello, World!')
   }

   return <button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy Text'}</button>
}
```

## Alternative: Non-React Usage

For use outside of React components, use the standalone function:

```ts
import { copyToClipboardFn } from 'classic-react-hooks'

// Simple copy
copyToClipboardFn('Text to copy')

// With callbacks
copyToClipboardFn(
   'Text to copy',
   () => console.log('Copied successfully!'),
   (error) => console.error('Copy failed:', error)
)
```
