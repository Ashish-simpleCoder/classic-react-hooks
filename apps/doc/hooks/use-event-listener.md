---
outline: deep
---

# use-event-listener

-  A hook for handling dom events in efficient and declarative manner.

### Parameters

| Parameter         |           Type            | Required | Default Value | Description                                         |
| ----------------- | :-----------------------: | :------: | :-----------: | --------------------------------------------------- |
| target            | [Target](#parametertype)  |    ✅    |       -       | Reference of the html element                       |
| event             |          string           |    ✅    |       -       | Event name                                          |
| handler           | [Handler](#parametertype) |    ❌    |   undefined   | Callback for the event                              |
| options           | [Options](#parametertype) |    ❌    |   undefined   | For managing Event Propagation                      |
| shouldInjectEvent |          boolean          |    ❌    |     true      | Based on it's value, event can be removed and added |

### Returns

`cleanup function` : Cleanup function for removing events manually.

### Types

---

#### ParameterType

```ts
type Target = null | EventTarget | (() => EventTarget | null)
type Options = boolean | AddEventListenerOptions
type Handler = (event: Event) => void
```

### Usage

```ts
import { useEventListener } from 'classic-react-hooks'

export default function YourComponent() {
   const ref = useRef()
   useEventListener(
      () => ref.current,
      'click',
      (e) => {
         console.log(e)
      }
   )

   return (
      <div>
         <button ref={ref}>button</button>
      </div>
   )
}
```
