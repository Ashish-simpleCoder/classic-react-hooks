import React, { ChangeEvent, useState } from 'react'
import useDebouncedFn from './use-debounced-fn'
import ExampleContainer from '../../components/example-container'

export default function Example() {
   const [input, setInput] = useState('')
   const [debouncedInput, setDebouncedInput] = useState('')
   const updateInput = useDebouncedFn((e: ChangeEvent<HTMLInputElement>) => {
      setDebouncedInput(e.target.value)
   })

   return (
      <>
         <ExampleContainer className='flex-col sm:flex-row p-0 gap-0 overflow-hidden'>
            <div className='flex flex-col gap-4 flex-1 md:border-solid bg-red-50 dark:bg-red-950 px-4 py-6'>
               <h4 className='text-sm !m-0'>
                  Debouncing <span className='text-red-500'>(off)</span>
               </h4>
               <div className='w-full'>
                  <input
                     onChange={(e) => setInput(e.target.value)}
                     className='border w-full mb-3 py-1 px-3 rounded-md bg-white dark:bg-gray-900'
                     placeholder='type something...'
                  />
                  <p className='!m-0 text-sm'>
                     value - <span className='p-1 ml-1'>{input}</span>
                  </p>
               </div>
            </div>

            <div className='flex flex-col gap-4 flex-1 px-4 py-6 bg-green-50 dark:bg-green-950'>
               <h4 className='text-sm !m-0'>
                  Debouncing <span className='text-green-500'>(on)</span>
               </h4>
               <div className='w-full'>
                  <input
                     onChange={updateInput}
                     className='border w-full mb-3 py-1 px-3 rounded-md bg-white dark:bg-gray-900'
                     placeholder='type something...'
                  />
                  <p className='!m-0 text-sm'>
                     value - <span className='p-1 ml-1'>{debouncedInput}</span>
                  </p>
               </div>
            </div>
         </ExampleContainer>
      </>
   )
}
