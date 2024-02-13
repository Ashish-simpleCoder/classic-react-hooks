---
outline: deep
---
# use-copy-to-clipboard

- A hook for copying the data in the clipboard with success and error callbacks.


## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-copy-to-clipboard/example'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details example.tsx
<<< @/../src/lib/use-copy-to-clipboard/example.tsx{6,22-26}
:::

::: details use-copy-to-clipboard.tsx
<<< @/../src/lib/use-copy-to-clipboard/use-copy-to-clipboard.tsx
:::