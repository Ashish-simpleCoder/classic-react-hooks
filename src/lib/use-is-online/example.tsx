import React from 'react'
import useIsOnline from './use-is-online'

export default function Example() {
   const isOnline = useIsOnline()

   return (
      <>
         <div className='flex flex-col sm:flex-row gap-4 border-gray-200 dark:border-gray-800 border px-4 py-2 rounded-md'>
            <div className='flex flex-col gap-2'>
               <h4>
                  online status :- <strong>{isOnline ? '🆗' : '❎'}</strong>
               </h4>
               <p className='font-light text-sm !m-0'>Turn on/off your wifi to see it working</p>
            </div>
         </div>
      </>
   )
}
