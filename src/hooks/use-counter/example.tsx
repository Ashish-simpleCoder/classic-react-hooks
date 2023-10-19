import React from 'react'
import useCounter from './use-counter'

export default function Example() {
   const {counter,decrementCounter,incrementCounter} = useCounter()

   return (
      <>
         <div className='flex flex-col sm:flex-row gap-4 border-gray-200 dark:border-gray-800 border px-4 py-2 rounded-md'>
            <div className='flex flex-row gap-4 items-center w-full'>
               <button
                  className='px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800'
                  onClick={incrementCounter}
               >
                  increment
               </button>
               <p className='!m-0 text-green-500'>{counter}</p>
               <button
                  className='px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800'
                  onClick={decrementCounter}
               >
                  decrement
               </button>
            </div>
         </div>
      </>
   )
}
