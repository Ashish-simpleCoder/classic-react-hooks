---
outline: deep
---
# use-interval-effect

- A hooks which fires the provided callback every time when the given delay is passed, just like the setInterval.


## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-interval-effect/example'
import useIntervalEffect from '../../src/lib/use-interval-effect/use-interval-effect'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details example.tsx
<<< @/../src/lib/use-interval-effect/example.tsx{2,6,17,18,13}
:::

::: details use-interval-effect.tsx
<<< @/../src/lib/use-interval-effect/use-interval-effect.tsx
:::
