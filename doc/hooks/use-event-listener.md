---
outline: deep
---
# use-event-listener

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

::: details example.tsx
<<< @/../src/lib/use-event-listener/example.tsx{2,11-16,26}
:::

::: details use-event-listener.tsx
<<< @/../src/lib/use-event-listener/use-event-listener.tsx
:::
