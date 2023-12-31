---
outline: deep
---
# use-synced-effect

- A hooks that fires the given callback for given dependencies.
> *Note* :- The provided callback doesn't fire on initial mount. Only runs when the provided dependecies changes.


## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-synced-effect/example'
import useSyncedEffect from '../../src/lib/use-synced-effect/use-synced-effect'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details example.tsx
<<< @/../src/lib/use-synced-effect/example.tsx{2,8-16}
:::

::: details useSyncedEffect.tsx
<<< @/../src/lib/use-synced-effect/use-synced-effect.tsx
:::
