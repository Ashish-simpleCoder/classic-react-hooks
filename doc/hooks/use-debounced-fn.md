---
outline: deep
---
# use-debouced-fn

- A hook which returns a debounced function.

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

::: details example.tsx
<<< @/../src/lib/use-debounced-fn/example.tsx{7-9,18,23,33,38}
:::

::: details use-debouced-fn.tsx
<<< @/../src/lib/use-debounced-fn/use-debounced-fn.tsx
:::

