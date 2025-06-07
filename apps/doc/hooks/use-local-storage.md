---
outline: deep
---

# use-local-storage

-  A React hook that synchronizes state with localStorage, providing `persistent` state management across browser `sessions`.
-  Works exactly like `useState` but automatically persists data to localStorage.

### Features

-  **Automatic sync:** Automatic localStorage synchronization
-  **Persistence updates:** Seamless state updates with persistence
-  **Error handling:** Built-in error handling and fallbacks
-  **Compatible API:** useState-compatible API
-  **Automatic parsing:** JSON serialization/deserialization

### Parameters

| Parameter    |  Type  | Required | Default Value | Description                               |
| ------------ | :----: | :------: | :-----------: | ----------------------------------------- |
| key          | string |    ✅    |       -       | Unique key for localStorage item          |
| defaultValue |  any   |    ❌    |   undefined   | Initial value when no stored value exists |

### Returns

-  It returns an array containing:

   1. `state:` Current value (type inferred from defaultValue)
   2. `setState:` State setter function (identical to useState setter)

### Usage Examples

#### Basic User Preferences

```ts
import { useLocalStorage } from 'classic-react-hooks'

function UserPreferences() {
   const [theme, setTheme] = useLocalStorage({ key: 'theme', defaultValue: 'light' })
   const [language, setLanguage] = useLocalStorage({ key: 'language', defaultValue: 'en' })

   return (
      <div>
         <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
         </select>

         <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value='en'>English</option>
            <option value='es'>Spanish</option>
            <option value='fr'>French</option>
         </select>
      </div>
   )
}
```

#### Complex Object State

```ts
interface UserProfile {
   name: string
   email: string
   preferences: {
      notifications: boolean
      newsletter: boolean
   }
}

function ProfileForm() {
   const [profile, setProfile] = useLocalStorage<UserProfile>({
      key: 'user-profile',
      defaultValue: {
         name: '',
         email: '',
         preferences: {
            notifications: true,
            newsletter: false,
         },
      },
   })

   const updateName = (name: string) => {
      setProfile((prev) => ({
         ...prev,
         name,
      }))
   }

   const toggleNotifications = () => {
      setProfile((prev) => ({
         ...prev,
         preferences: {
            ...prev.preferences,
            notifications: !prev.preferences.notifications,
         },
      }))
   }

   return (
      <form>
         <input value={profile.name} onChange={(e) => updateName(e.target.value)} placeholder='Enter your name' />

         <input
            type='email'
            value={profile.email}
            onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
            placeholder='Enter your email'
         />

         <label>
            <input type='checkbox' checked={profile.preferences.notifications} onChange={toggleNotifications} />
            Enable notifications
         </label>
      </form>
   )
}
```

### Important Notes

-  **Automatic Serialization:** Data is automatically serialized to JSON when storing.
-  **Synchronous Updates:** State updates are synchronous and immediately persisted.
-  **No storage events:** Changes in one tab don't automatically sync to other tabs (consider storage events for that).
-  **Fallback value:** Always provide default values for SSR fallback.

### Common Use Cases

-  Theme preferences (dark/light mode)
-  Form draft saving (auto-save functionality)
-  Shopping cart persistence
-  User settings and preferences
-  Feature flags for application
