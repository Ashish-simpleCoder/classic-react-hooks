import React, { useState } from 'react'
import useTimeoutEffect from './use-timeout-effect'
import ExampleContainer from '../../components/example-container'

export default function Example() {
   const [counter, setCounter] = useState(0)
   useTimeoutEffect(() => setCounter((c) => c + 10), 3000)

   return (
      <>
         <ExampleContainer>
            <p className='text-sm !m-0'>
               Counter will be updated to <strong className='text-green-600 font-medium'>10</strong> after{' '}
               <strong className='text-green-600 font-medium'>3 seconds</strong>.
            </p>
            <div className='flex flex-row  gap-4 items-center'>
               <h4>
                  counter :- <strong>{counter}</strong>
               </h4>
            </div>
         </ExampleContainer>
      </>
   )
}
