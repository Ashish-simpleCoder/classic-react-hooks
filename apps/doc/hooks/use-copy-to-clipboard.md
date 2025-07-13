---
outline: deep
---

# use-copy-to-clipboard

A React hook that provides a simple and reliable way to copy text to the clipboard with success and error handling callbacks.

## Features

-  **Clipboard API Support:** Uses the modern `navigator.clipboard` API for secure clipboard access
-  **Fallback Handling:** Gracefully handles cases where clipboard API is not available
-  **Success/Error Callbacks:** Built-in success and error handling with customizable callbacks
-  **Flexible Configuration:** Configure global callbacks via props or override per-call
-  **Performance Optimized:** Zero re-renders - purely ref-based

## Parameters

| Parameter |             Type              | Required | Default Value | Description                       |
| --------- | :---------------------------: | :------: | :-----------: | --------------------------------- |
| onSuccess | [OnSuccess](#parameter-types) |    ❌    |       -       | Default success callback function |
| onError   |  [OnError](#parameter-types)  |    ❌    |       -       | Default error callback function   |

### Parameter Types

```ts
type OnSuccess = () => void
type OnError = (err: Error) => void
```

## Returns

-  `copyToClipboard` - Handler function to copy text data

### Return Types

```ts
type CopyToClipboardFn = (data: string, onSuccess?: OnSuccess, onError?: OnError) => Promise<void>
```

## Usage Examples

### Basic usage

```ts
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

## Common Use Cases

-  Copy text data

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

## Error Handling

The hook handles various error scenarios:

-  **Clipboard API not available:** When `navigator.clipboard` is not supported

All errors are passed to the `onError` callback with descriptive error messages.
