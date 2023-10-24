import React, { ElementRef, useRef, useState } from 'react'
import useSyncedEffect from './use-synced-effect'

export default function Example() {
   const [counter, setCounter] = useState(0)
   const logRef = useRef<ElementRef<"div">>(null)

   useSyncedEffect(() => {
      const p = document.createElement("p")
      p.innerText = `counter is ${counter}.`
      logRef.current!.appendChild(p)

      return () => {
         console.log("unmount")
      }
   }, [counter])

   return (
      <>
         <div className='flex flex-col gap-4 border-gray-200 dark:border-gray-800 border px-4 py-2 rounded-md'>
            <div className="flex flex-row">
               {counter}
               <button
                  className='px-3 py-2 ml-auto rounded-md bg-gray-200 dark:bg-gray-800'
                  onClick={() => setCounter((c) => c + 1)}
               >
                  increment
               </button>
            </div>

            <div className="bg-gray-200 dark:bg-gray-800 px-2" ref={logRef}></div>
         </div>
      </>
   )
}
