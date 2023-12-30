import React, { useState } from 'react'

import useSyncedRef from './use-synced-ref'
import ExampleContainer from '../../components/example-container'

export default function Example() {
   const [counter, setCounter] = useState(0)
   const counterRef = useSyncedRef(counter)

   return (
      <>
         <ExampleContainer className='flex-col sm:flex-row'>
            <div className='flex flex-row  gap-4 items-center'>
               <h4>counter :- {counter}</h4>
               <button
                  className='px-3 py-2 ml-auto rounded-md bg-gray-200 dark:bg-gray-800'
                  onClick={() => setCounter((c) => c + 1)}>
                  increment
               </button>
            </div>

            <button
               className='px-3 py-2 max-sm:w-full sm:ml-auto rounded-md bg-gray-200 dark:bg-gray-800'
               onClick={() => alert('counter-ref value -> ' + counterRef.current)}>
               print counter-ref
            </button>
         </ExampleContainer>
      </>
   )
}
