---
outline: deep
---

# use-copy-to-clipboard

_`use-copy-to-clipboard`_ is a lightweight React hook that provides a simple and reliable way to copy text to the clipboard with built-in success and error handling.

It leverages the modern Clipboard API while gracefully handling unsupported environments. The hook avoids unnecessary state updates by using a ref-based implementation, ensuring zero re-renders. It also allows flexible configuration through global and per-call callbacks.

## Features

-  **Modern Clipboard API:** Uses [navigator.clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) for secure, async clipboard access
-  **Graceful fallback handling:** Safely handles environments without clipboard support
-  **Success & error callbacks:** Built-in hooks for handling copy outcomes
-  **Flexible callback configuration:** Define global callbacks or override them per copy call
-  **Zero re-renders:** Ref-based implementation ensures optimal performance
-  **Promise-based API:** Enables async handling and easy error chaining

## Problems It Solves

-  Removes repetitive clipboard access logic from components
-  Handles browser support differences for clipboard operations
-  Simplifies success and error handling for copy actions
-  Prevents unnecessary re-renders when copying data
-  Centralizes clipboard logic for reuse across the application
-  Reduces error-prone imperative clipboard code

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
