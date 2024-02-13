import React, { useState } from 'react'

import useSyncedRef from './use-synced-ref'
import ExampleContainer from '../../components/example-container'
import AppButton from '../../components/app-button'

export default function Example() {
   const [counter, setCounter] = useState(0)
   const counterRef = useSyncedRef(counter)

   return (
      <>
         <ExampleContainer className='flex-col sm:flex-row'>
            <div className='flex flex-col gap-4'>
               <h4>counter :- {counter}</h4>
               <div className='flex gap-4'>
                  <AppButton onClick={() => setCounter((c) => c + 1)}>increment</AppButton>

                  <AppButton onClick={() => alert('counter ref value -> ' + counterRef.current)}>
                     print counter ref
                  </AppButton>
               </div>
            </div>
         </ExampleContainer>
      </>
   )
}
