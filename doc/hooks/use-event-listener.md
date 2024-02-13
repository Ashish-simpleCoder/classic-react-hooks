---
outline: deep
---
# useEventListener

- A hook for adding dom events in declarative manner.


## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-event-listener/example'
import {useEventListener} from '../../src/lib/use-event-listener/use-event-listener'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details Example.tsx
<<< @/../src/lib/use-event-listener/example.tsx{4,10-16,26}
:::

::: details useEventListener.tsx
<<< @/../src/lib/use-event-listener/use-event-listener.tsx
:::
