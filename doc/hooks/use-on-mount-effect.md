---
outline: deep
---
# use-on-mount-effect

- A hooks that fires the given callback once after the mount.
> *Note* :- The provided callback fires only once after the mount. It doesn't take any dependencies.


## Example


<div ref="el" />

<script setup>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ref, onMounted } from 'vue'
import Example from '../../src/lib/use-on-mount-effect/example'
import useOnMountEffect from '../../src/lib/use-on-mount-effect/use-on-mount-effect'

const el = ref()
onMounted(() => {
   const root = createRoot(el.value)
   root.render(createElement(Example, {}, null))
})
</script>

## Code Snippets

::: details Example.tsx
<<< @/../src/lib/use-on-mount-effect/example.tsx{2,8-16}
:::

::: details useOnMountEffect.tsx
<<< @/../src/lib/use-on-mount-effect/use-on-mount-effect.tsx
:::
