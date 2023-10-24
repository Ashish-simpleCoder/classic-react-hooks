---
outline: deep
---
# useLocalStorage

- A hook for managing the states with local-storage.
- It automatically updates the state in local-storage.

## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-local-storage/example'
import useLocalStorage from '../../src/lib/use-local-storage/use-local-storage'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details Example.tsx
<<< @/../src/lib/use-local-storage/example.tsx{5,11-13,17-19,27}
:::

::: details useLocalStorage.tsx
<<< @/../src/lib/use-local-storage/use-local-storage.tsx
:::
