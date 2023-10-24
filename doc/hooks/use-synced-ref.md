---
outline: deep
---
# useSyncedRef

- Like `useRef` hook, but it automatically syncs-up with the given state.


## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-synced-ref/example'
import useSyncedRef from '../../src/lib/use-synced-ref/use-synced-ref'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details Example.tsx
<<< @/../src/lib/use-synced-ref/example.tsx{2,6}
:::

::: details useSyncedRef.tsx
<<< @/../src/lib/use-synced-ref/use-synced-ref.tsx
:::


<!-- ::: code-group

```sh [ts]
$ npm add -D vitepress
```

```sh [js]
$ pnpm add -D vitepress
```

::: -->
