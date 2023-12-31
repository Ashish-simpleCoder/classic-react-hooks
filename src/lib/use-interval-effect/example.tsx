import React, { useState } from 'react'
import useIntervalEffect from './use-interval-effect'
import ExampleContainer from '../../components/example-container'
import AppButton from '../../components/app-button'

export default function Example() {
   const [counter, setCounter] = useState(0)
   const { clearTimer, restartTimer } = useIntervalEffect(() => setCounter((c) => c + 1), 1000)

   return (
      <>
         <ExampleContainer>
            <p className='text-sm !m-0'>
               Counter will be incrementing by <strong className='text-green-600 font-medium'>1</strong> after every{' '}
               <strong className='text-green-600 font-medium'>1 seconds</strong>.
            </p>
            <div className='flex flex-row  gap-4 items-center'>
               <h4>
                  counter :- <strong>{counter}</strong>
               </h4>
            </div>

            <div className='flex flex-row gap-4'>
               <AppButton color='error' onClick={clearTimer}>
                  clear interval
               </AppButton>
               <AppButton onClick={restartTimer}>restart interval</AppButton>
            </div>
         </ExampleContainer>
      </>
   )
}
