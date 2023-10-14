import React, { useState } from 'react'
import useIntervalEffect from './use-interval-effect'

export default function Example() {
   const [counter, setCounter] = useState(0)
   const { clearTimer, restartTimer } = useIntervalEffect(() => setCounter(c => c + 1), 1000)

   return (
      <>
         <div className='flex flex-col gap-4 border-gray-200 dark:border-gray-800 border px-4 py-2 rounded-md'>
            <p className="text-sm !m-0">Counter will be incrementing by <strong className="text-green-500">1</strong> after every <strong className="text-green-500">1 seconds</strong>.</p>
            <div className='flex flex-row  gap-4 items-center'>
               <h4>counter :- <strong className="text-blue-500">{counter}</strong></h4>
            </div>

            <div className="flex flex-row gap-4">
            <button className='px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800' onClick={clearTimer}>clear timer</button>
            <button className='px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800' onClick={restartTimer}>restart timer</button>
            </div>
         </div>
      </>
   )
}
