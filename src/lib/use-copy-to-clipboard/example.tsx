import React, { useState } from 'react'
import AppButton from '../../components/app-button'
import useCopyToClipboard from './use-copy-to-clipboard'

export default function Example() {
   const copyToClipboard = useCopyToClipboard()
   const [data, setData] = useState('')

   return (
      <>
         <div className='flex flex-col sm:flex-row gap-4 bg-gray-100 dark:bg-custom-gray-dark  px-4 py-6 rounded-md'>
            <div className='flex flex-row gap-4 items-center w-full'>
               <input
                  className='border border-solid px-4 py-2 rounded-md'
                  placeholder='enter data to copy'
                  value={data}
                  onChange={(e) => setData(e.target.value)}
               />
               <AppButton
                  color='error'
                  onClick={() =>
                     copyToClipboard(
                        data,
                        () => console.log('success'),
                        (err) => console.log(err)
                     )
                  }>
                  copy
               </AppButton>
            </div>
         </div>
      </>
   )
}
