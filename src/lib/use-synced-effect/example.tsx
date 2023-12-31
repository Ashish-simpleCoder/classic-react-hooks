import React, { ElementRef, useRef, useState } from 'react'
import useSyncedEffect from './use-synced-effect'
import ExampleContainer from '../../components/example-container'
import AppButton from '../../components/app-button'

export default function Example() {
   const [counter, setCounter] = useState(0)
   const logRef = useRef<ElementRef<'div'>>(null)

   useSyncedEffect(() => {
      const p = document.createElement('p')
      p.innerText = `counter is ${counter}.`
      logRef.current!.appendChild(p)

      return () => {
         console.log('unmount')
      }
   }, [counter])

   return (
      <>
         <ExampleContainer>
            <div className='flex flex-row'>
               {counter}
               <AppButton className=' ml-auto' onClick={() => setCounter((c) => c + 1)}>
                  increment
               </AppButton>
            </div>

            <div className='bg-gray-200 dark:bg-gray-800 px-2' ref={logRef}></div>
         </ExampleContainer>
      </>
   )
}
