---
outline: deep
---

# use-outside-click

-  A hook that fires the given callback when clicked outside anywhere of the given html element.

### Parameters

| Parameter         |           Type            | Required | Default Value | Description                                         |
| ----------------- | :-----------------------: | :------: | :-----------: | --------------------------------------------------- |
| target            | [Target](#parametertype)  |    ✅    |       -       | Reference of the html element                       |
| handler           | [Handler](#parametertype) |    ❌    |   undefined   | Callback for the event                              |
| shouldInjectEvent |          boolean          |    ❌    |     true      | Based on it's value, event can be removed and added |

### Types

---

#### ParameterType

```ts
type Target = null | EventTarget | (() => EventTarget | null)
type Handler = (event: Event) => void
```

### Usage

```ts
import { useRef } from 'react'
import { useOutsideClick } from 'classic-react-hooks'

export default function YourComponent() {
   const modalRef = useRef(null)
   useOutsideClick(
      () => modalRef.current,
      (e) => {
         console.log('clicked outside on modal. Target = ', e.target)
      },
      true
   )

   return (
      <div>
         <div
            style={{
               width: '300px',
               height: '300px',
            }}
            ref={modalRef}
         >
            This is modal
         </div>
      </div>
   )
}
```
