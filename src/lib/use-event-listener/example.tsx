import React, { ElementRef, useRef, useState } from 'react'
import { useEventListener } from './use-event-listener'
import ExampleContainer from '../../components/example-container'
import AppButton from '../../components/app-button'

export default function Example() {
   const [target, setTarget] = useState<string | null>(null)
   const [event_type, setEventType] = useState<keyof DocumentEventMap>('click')
   const logRef = useRef<ElementRef<'div'>>(null)

   useEventListener(target ? document.querySelector(target) : null, event_type, (e) => {
      // console.log(e.target)
      const p = document.createElement('p')
      p.innerText = `element=${e.target.nodeName} | event=${event_type} | content=${e.target.textContent}`
      logRef.current!.prepend(p)
   })

   return (
      <>
         <ExampleContainer>
            <div className='flex gap-6 max-sm:flex-col'>
               <div className='form-group flex items-center gap-2 justify-between flex-1'>
                  <label htmlFor='target'>Target</label>
                  <select
                     name='target'
                     id='target'
                     className='px-4 py-2 rounded-md w-full'
                     onChange={(e) => setTarget(e.target.value)}>
                     <option selected disabled>
                        select
                     </option>
                     <option value='.btn-1'>btn-1</option>
                     <option value='.head-1'>h-1</option>
                  </select>
               </div>
               <div className='form-group flex items-center gap-2 justify-between flex-1'>
                  <label htmlFor='target' className='whitespace-nowrap'>
                     Event
                  </label>
                  <select
                     name='event-type'
                     id='event-type'
                     className='px-4 py-2 rounded-md w-full'
                     onChange={(e) => setEventType(e.target.value as keyof DocumentEventMap)}>
                     <option value='click'>click</option>
                     <option value='mouseenter'>hover</option>
                  </select>
               </div>
            </div>

            <div className='flex gap-4 max-sm:flex-col'>
               <AppButton className='btn-1'>click me (btn-1)</AppButton>
               <AppButton className='head-1'>This is (h1-1)</AppButton>
            </div>

            <div className='bg-gray-200 dark:bg-gray-800 px-2 max-h-48 overflow-y-auto' ref={logRef}></div>
         </ExampleContainer>
      </>
   )
}
