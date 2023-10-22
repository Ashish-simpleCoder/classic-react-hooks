---
outline: deep
---
# useCounter

- A simple hook for managing counter.

## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/hooks/use-counter/example'
import useCounter from '../../src/hooks/use-counter/use-counter'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details Example.tsx
<<< @/../src/hooks/use-counter/example.tsx{5,13,17,20}
:::

::: details useCounter.tsx
<<< @/../src/hooks/use-counter/use-counter.tsx
:::
