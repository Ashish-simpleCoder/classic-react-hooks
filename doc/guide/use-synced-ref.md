---
outline: deep
---
# useSyncedRef


## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/hooks/use-synced-ref/example.tsx'
import useSyncedRef from '../../src/hooks/use-synced-ref/use-synced-ref'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>


::: details Example.tsx
<<< @/../src/hooks/use-synced-ref/example.tsx{2,6}
:::

::: details useSyncedRef.tsx
<<< @/../src/hooks/use-synced-ref/use-synced-ref.tsx
:::


<!-- ::: code-group

```sh [ts]
$ npm add -D vitepress
```

```sh [js]
$ pnpm add -D vitepress
```

::: -->
