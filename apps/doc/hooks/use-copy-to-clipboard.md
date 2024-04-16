---
outline: deep
---

# use-copy-to-clipboard

-  A hook for copying the data in the clipboard with success and error callbacks.

### Parameters

| Parameter |          Type           | Required | Default Value | Description |
| --------- | :---------------------: | :------: | :-----------: | ----------- |
| Object    | [Props](#parametertype) |    ❌    |       -       | Object      |

### Returns

[`CopyToClipboardFn`](#returntype) : A function for copying the data into clipboard

### Types

---

#### ParameterType

```ts
type Props = {
   onSuccess?: OnSuccess
   onError?: onError
}

type OnSuccess = () => void
type OnError = (err: Error) => void
```

#### ReturnType

```ts
type CopyToClipboardFn = (data: string, onSuccess?: OnSuccess, onError?: OnError) => Promise<void>
```

### Usage

```ts
import { useState } from 'react'
import { useCopyToClipboard } from 'classic-react-hooks'

export default function YourComponent() {
   const [data, setData] = useState('')
   const copyToClipboard = useCopyToClipboard()

   return (
      <div>
         <input placeholder='enter data to copy' value={data} onChange={(e) => setData(e.target.value)} />
         <button
            onClick={() =>
               copyToClipboard(
                  data,
                  () => console.log('success'),
                  (err) => console.log(err)
               )
            }
         >
            copy
         </button>
      </div>
   )
}
```
