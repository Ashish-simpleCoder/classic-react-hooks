---
outline: deep
---

# use-outside-click

-  A hook that fires the given callback when clicked outside anywhere of the given html element.

### Parameters

| Parameter |           Type            | Required | Default Value | Description                   |
| --------- | :-----------------------: | :------: | :-----------: | ----------------------------- |
| target    | [Target](#parametertype)  |    ✅    |       -       | Reference of the html element |
| handler   | [Handler](#parametertype) |    ❌    |   undefined   | Callback for the event        |
| options   | [Options](#parametertype) |    ❌    |   undefined   | Extra params                  |

### Types

---

#### ParameterType

```ts
type Target = null | EventTarget | (() => EventTarget | null)
type Options = { shouldInjectEvent?: boolean | any }
type Handler = (event: Event) => void
```

### Usage

```ts
import { useRef } from 'react'
import { useOutsideClick } from 'classic-react-hooks'

export default function YourComponent() {
   const modalRef = useRef(null)
   useOutsideClick(
      modalRef,
      (e) => {
         console.log('clicked outside on modal. Target = ', e.target)
      },
      { shouldInjectEvent: true }
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
