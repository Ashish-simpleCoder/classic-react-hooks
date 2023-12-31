import React from 'react'
import useCounter from './use-counter'
import AppButton from '../../components/app-button'

export default function Example() {
   const { counter, decrementCounter, incrementCounter } = useCounter()

   return (
      <>
         <div className='flex flex-col sm:flex-row gap-4 bg-gray-100 dark:bg-custom-gray-dark  px-4 py-6 rounded-md'>
            <div className='flex flex-row gap-4 items-center w-full'>
               <AppButton color='error' onClick={decrementCounter}>
                  decrement
               </AppButton>
               <p className='!m-0 font-semibold'>{counter}</p>
               <AppButton onClick={incrementCounter}>increment</AppButton>
            </div>
         </div>
      </>
   )
}
