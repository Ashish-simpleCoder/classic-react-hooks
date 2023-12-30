import React, { useState } from 'react'
import useTimeoutEffect from './use-timeout-effect'

export default function Example() {
   const [counter, setCounter] = useState(0)
   useTimeoutEffect(() => setCounter((c) => c + 10), 3000)

   return (
      <>
         <div className='flex flex-col gap-4 border-gray-200 dark:border-gray-800 border px-4 py-2 rounded-md'>
            <p className='text-sm !m-0'>
               Counter will be updated to <strong className='text-green-500'>10</strong> after{' '}
               <strong className='text-green-500'>3 seconds</strong>.
            </p>
            <div className='flex flex-row  gap-4 items-center'>
               <h4>
                  counter :- <strong className='text-blue-500'>{counter}</strong>
               </h4>
            </div>
         </div>
      </>
   )
}
