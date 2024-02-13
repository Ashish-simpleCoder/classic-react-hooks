import React, { ElementRef, useRef, useState } from 'react'
import useOnMountEffect from './use-on-mount-effect'
import ExampleContainer from '../../components/example-container'
import AppButton from '../../components/app-button'

export default function Example() {
   const [counter, setCounter] = useState(10)
   const logRef = useRef<ElementRef<'div'>>(null)

   useOnMountEffect(() => {
      const p = document.createElement('p')
      p.innerText = `counter is ${counter}.`
      logRef.current!.appendChild(p)

      return () => {
         console.log('unmount')
      }
   })

   return (
      <>
         <ExampleContainer>
            <div className='flex flex-row'>
               {counter}
               <AppButton className='ml-auto' onClick={() => setCounter((c) => c + 1)}>
                  increment
               </AppButton>
            </div>

            <div className='bg-gray-200 dark:bg-gray-800 px-2' ref={logRef}></div>
         </ExampleContainer>
      </>
   )
}
