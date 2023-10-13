import React, { ChangeEvent, useState } from 'react'
import useDebouncedFn from './use-debounced-fn'

export default function Example() {
   const [input, setInput] = useState('')
   const [debouncedInput, setDebouncedInput] = useState('')
   const updateInput = useDebouncedFn((e: ChangeEvent<HTMLInputElement>) => {
      setDebouncedInput(e.target.value)
   })

   return (
      <>
         <div className='flex flex-col gap-6 border-gray-200 dark:border-gray-800 border px-4 py-2 rounded-md'>
            <div className='flex flex-col gap-2'>
               <h4 className='text-sm !m-0'>With Debouncing</h4>
               <input
                  onChange={updateInput}
                  className='border border-solid border-gray-200 dark:border-gray-800 py-1 px-3 rounded-md'
                  placeholder='type something...'
               />
               <p className='!m-0 text-sm'>
                  input - <span className='border border-solid p-1 ml-1'>{debouncedInput}</span>
               </p>
            </div>

            <div className='border-b border-gray-300 dark:border-gray-800'></div>

            <div className='flex flex-col gap-2'>
               <h4 className='text-sm !m-0'>Without Debouncing</h4>
               <input
                  onChange={(e) => setInput(e.target.value)}
                  className='border border-solid border-gray-200 dark:border-gray-800 py-1 px-3 rounded-md'
                  placeholder='type something...'
               />
               <p className='!m-0 text-sm'>
                  input - <span className='border border-solid p-1 ml-1'>{input}</span>
               </p>
            </div>
         </div>
      </>
   )
}
