---
outline: deep
---
# use-synced-ref

- A replacement for `useRef` hook, which automatically syncs-up with the given state.
- No need to manually update the ref.


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

::: details example.tsx
<<< @/../src/lib/use-synced-ref/example.tsx{2,6}
:::

::: details use-synced-ref.tsx
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
