---
outline: deep
---
# use-timeout-effect

- A hooks which fires the provided callback only once when the given delay is passed, just like the setTimeout.



## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-timeout-effect/example'
import useTimeoutEffect from '../../src/lib/use-timeout-effect/use-timeout-effect'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details example.tsx
<<< @/../src/lib/use-timeout-effect/example.tsx{2,6}
:::

::: details use-timeout-effect.tsx
<<< @/../src/lib/use-timeout-effect/use-timeout-effect.tsx
:::
