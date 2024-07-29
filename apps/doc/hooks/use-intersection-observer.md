---
outline: deep
---

# use-intersection-observer

-  A hook which provides a way for listening to the Intersection Observer event for given target.
-  It returns an array of boolean values which represents whether the targets are intersecting the screen or not.

### Parameters

| Parameter |            Type            | Required | Default Value | Description                                                   |
| --------- | :------------------------: | :------: | :-----------: | ------------------------------------------------------------- |
| targets   | [Target[]](#parametertype) |    ✅    |       -       | Array of targets which contains reference of the html element |
| options   | [Options](#parametertype)  |    ❌    |      {}       | Options to pass as feature flag                               |

### Types

---

#### ParameterType

```ts
type Target = HTMLElement | RefObject<HTMLElement> | (() => HTMLElement | null) | null
type Options = {
   mode?: 'lazy' | 'virtualized'
} & IntersectionObserverInit
```

### Usage

```ts
import { ElementRef, useRef } from 'react'
import { useInterSectionObserver } from 'classic-react-hooks'

export default function Intersection() {
   const purpleBoxRef = useRef<ElementRef<'div'>>(null)
   const greenBoxRef = useRef<ElementRef<'div'>>(null)
   const [isPurpleVisible, isGreenVisible] = useInterSectionObserver([purpleBoxRef, greenBoxRef], {
      threshold: 0,
      root: null,
      rootMargin: '-150px',
      mode: 'virtualized',
   })

   return (
      <>
         <h1 className='text-2xl px-4 text-green-800 border-b-2 pb-2 border-black'>
            Scroll to the very bottom of the page
         </h1>

         <p className='p-10 my-32'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quae illum rem quod recusandae a tempora
            officia natus quos dignissimos, eum beatae ea! Consectetur nemo assumenda eligendi optio voluptatum fuga.
         </p>
         <p className='p-10 my-32'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi quae illum rem quod recusandae a tempora
            officia natus quos dignissimos, eum beatae ea! Consectetur nemo assumenda eligendi optio voluptatum fuga.
         </p>

         <div
            ref={purpleBoxRef}
            className={`h-[500px] mb-6 w-1/2 mx-auto bg-purple-400 duration-1000 transition-all flex items-center justify-center ${
               isPurpleVisible ? 'translate-x-0 rounded-full' : '-translate-x-[500px] opacity-0 rounded-0'
            }`}
         >
            purple
         </div>
         <div
            ref={greenBoxRef}
            className={`h-[500px] mb-6 w-1/2 mx-auto bg-green-400 duration-1000 transition-all flex items-center justify-center ${
               isGreenVisible ? 'translate-x-0 rounded-full' : '-translate-x-[500px] opacity-0 rounded-0'
            }`}
         >
            green
         </div>
      </>
   )
}
```
