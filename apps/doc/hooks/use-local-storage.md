---
outline: deep
---

# use-local-storage

-  A hook for managing the states with `local-storage`
-  It automatically updates the state in `local-storage`
-  `useState` with local storage power.

### Parameters

| Parameter    |  Type  | Required | Default Value | Description                                            |
| ------------ | :----: | :------: | :-----------: | ------------------------------------------------------ |
| key          | string |    ✅    |       -       | key for getting from local-storage                     |
| defaultValue |  any   |    ❌    |       -       | A initial value when item is not present local-storage |

### Returns

-  It returns an array of `state` and setter function `setState`.
-  `state` : It's type get inferred by `defaultValue` parameter.
-  `setState` : A function just like the setter function from `useState`.

### Usage

```ts
import { useLocalStorage } from 'classic-react-hooks'

export default function YourComponent() {
   const [user_details, setUserDetails] = useLocalStorage('user_details', {
      name: '',
   })

   return (
      <div>
         <input
            value={user_details.name}
            onChange={(e) =>
               setUserDetails((user) => {
                  user.name = e.target.value
                  return {
                     ...user,
                  }
               })
            }
            className='py-1 px-3 rounded-md bg-white dark:bg-gray-900'
            placeholder='update name...'
         />
      </div>
   )
}
```
