import React from 'react'
import useIsOnline from './use-is-online'
import ExampleContainer from '../../components/example-container'

export default function Example() {
   const isOnline = useIsOnline()

   return (
      <>
         <ExampleContainer>
            <div className='flex flex-col gap-2'>
               <h4>
                  online status :- <strong>{isOnline ? '🆗' : '❎'}</strong>
               </h4>
               <p className='font-light text-sm !m-0'>Turn on/off your wifi to see it working</p>
            </div>
         </ExampleContainer>
      </>
   )
}
