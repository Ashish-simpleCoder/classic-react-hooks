---
outline: deep
---

# use-event-listener

-  A hook which handles dom events in efficient and declarative manner.

### Parameters

| Parameter |           Type            | Required | Default Value | Description                    |
| --------- | :-----------------------: | :------: | :-----------: | ------------------------------ |
| target    | [Target](#parametertype)  |    ✅    |       -       | Reference of the html element  |
| event     |          string           |    ✅    |       -       | Event name                     |
| handler   | [Handler](#parametertype) |    ❌    |   undefined   | Callback for the event         |
| options   | [Options](#parametertype) |    ❌    |   undefined   | For managing Event Propagation |

### Types

---

#### ParameterType

```ts
type Target = null | EventTarget | (() => EventTarget | null)
type Options = boolean | (AddEventListenerOptions & { shouldInjectEvent?: boolean | any })
type Handler = (event: Event) => void
```

### Usage

```ts
import { useRef } from 'react'
import { useEventListener } from 'classic-react-hooks'

export default function YourComponent() {
   const ref = useRef()
   useEventListener(ref, 'click', (e) => {
      console.log(e)
   })

   return (
      <div>
         <button ref={ref}>button</button>
      </div>
   )
}
```
