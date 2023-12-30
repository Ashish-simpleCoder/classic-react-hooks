import React from 'react'
import useLocalStorage from './use-local-storage'
import ExampleContainer from '../../components/example-container'

export default function Example() {
   const [user_details, setUserDetails] = useLocalStorage('user_details', { coder: false, name: '' })

   return (
      <>
         <ExampleContainer>
            <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
               <input
                  value={user_details.name}
                  onChange={(e) =>
                     setUserDetails((user) => {
                        user.name = e.target.value
                        return { ...user }
                     })
                  }
                  className='py-1 px-3 rounded-md bg-white dark:bg-gray-900'
                  placeholder='update name...'
               />

               <div className='flex gap-2'>
                  <input
                     type='checkbox'
                     id='coder'
                     aria-label='coder'
                     checked={user_details.coder}
                     onChange={(e) =>
                        setUserDetails((user) => {
                           user.coder = e.target.checked
                           return { ...user }
                        })
                     }
                     className='border border-solid border-gray-200 dark:border-gray-800 py-1 px-3'
                     placeholder='name'
                  />
                  <label htmlFor='coder'>coder</label>
               </div>
            </div>

            <div>
               <p className='font-bold'>Updated Details</p>
               {JSON.stringify(user_details, null, 4)}
            </div>
         </ExampleContainer>
      </>
   )
}
