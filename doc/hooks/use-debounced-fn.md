---
outline: deep
---
# use-debouced-fn

- A hook for managing operations with debouncing.

## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-debounced-fn/example'
import useDeboucedFn from '../../src/lib/use-debounced-fn/use-debounced-fn'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details Example.tsx
<<< @/../src/lib/use-debounced-fn/example.tsx{7-9,17,22}
:::

::: details useDeboucedFn.tsx
<<< @/../src/lib/use-debounced-fn/use-debounced-fn.tsx
:::

