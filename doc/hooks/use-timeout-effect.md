---
outline: deep
---
# useTimeoutEffect

- A hooks that runs the provided callback only once after the timer is completed.


## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/hooks/use-timeout-effect/example'
import useTimeoutEffect from '../../src/hooks/use-timeout-effect/use-timeout-effect'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details Example.tsx
<<< @/../src/hooks/use-timeout-effect/example.tsx{2,6}
:::

::: details useTimeoutEffect.tsx
<<< @/../src/hooks/use-timeout-effect/use-timeout-effect.tsx
:::
