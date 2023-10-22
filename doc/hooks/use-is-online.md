---
outline: deep
---
# useIsOnline

- A simple hook for getting the network connection state.

## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/hooks/use-is-online/example'
import useIsOnline from '../../src/hooks/use-is-online/use-is-online'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details Example.tsx
<<< @/../src/hooks/use-is-online/example.tsx{5,11}
:::

::: details useIsOnline.tsx
<<< @/../src/hooks/use-is-online/use-is-online.tsx
:::


<!-- ::: code-group

```sh [ts]
$ npm add -D vitepress
```

```sh [js]
$ pnpm add -D vitepress
```

::: -->
