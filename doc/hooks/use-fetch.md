# use-fetch

- A hook is used to fetch data from server without writing custom fetch logic.
- If the component is unmounted and the request is still in pending then this will cancel automatically.

## Example

<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-fetch/example.tsx'
import useFetch from '../../src/lib/use-fetch/use-fetch'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details example.tsx
<<< @/../src/lib/use-fetch/example.tsx
:::

::: details useFetch.tsx
<<< @/../src/lib/use-fetch/use-fetch.tsx
:::
