import React, { ElementRef, useRef, useState } from 'react'
import ResetWrapper from '../../components/reset-wrapper'
import { ResetSvg } from '../../components/svg-icons'
import { useEventListener } from './use-event-listener'

function Example() {
   const [counter, setCounter] = useState(0)
   const blueBtnRef = useRef<ElementRef<'button'>>(null)

   useEventListener(
      () => blueBtnRef.current,
      'click',
      () => {
         setCounter((c) => c + 1)
      }
   )

   return (
      <>
         <div className='flex flex-col gap-4 border-gray-200 dark:border-gray-800 border px-4 py-2 rounded-md'>
            <button className='reset-btn absolute right-2' title='reset example'>
               <ResetSvg />
            </button>

            <div className='flex flex-row items-center gap-4'>
               <button className='px-3 py-2 rounded-md bg-blue-200 dark:bg-blue-800' ref={blueBtnRef}>
                  increment
               </button>
               <p className="text-sm !m-0">{counter}</p>
            </div>
         </div>
      </>
   )
}

export default function ExampleContainer() {
   return (
      <>
         <ResetWrapper>
            <Example />
         </ResetWrapper>
      </>
   )
}


