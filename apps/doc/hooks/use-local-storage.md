---
outline: deep
---

# use-local-storage

A React hook that provides a seamless way to persist and synchronize state with `localStorage`, offering a `useState`-like API with cross-tab synchronization.

## Features

-  **_useState_ Compatible API:** Drop-in replacement with identical API including functional updates
-  **SSR Compatible:** Default values prevent hydration mismatches
-  **Auto Synchronization:** Seamless bidirectional sync between React state, `localStorage` and across different browser tabs
-  **Error handling:** Graceful fallbacks when localStorage operations fail
-  **Custom Encoding/Decoding:** Optional encoder and decoder for data transformation (encryption, compression, etc.)
-  **Dynamic Key Migration:** Automatically migrates data when key changes without data loss

::: danger Important Notes

-  **Automatic Serialization:** Data is automatically serialized to JSON when storing.
-  **Synchronous Updates:** State updates are synchronous and immediately persisted.
-  **Fallback value:** Always provide default values for SSR fallback.
-  **Encoder/Decoder:** Applied after JSON serialization and before JSON parsing respectively.
-  **Key Migration:** When key changes, old key is removed and data is migrated to new key automatically.
   :::

## Problem It Solves

::: details Manual LocalStorage Synchronization

---

**Problem:-** Manually keeping React state synchronized with `localStorage` requires complex boilerplate code and is prone to sync issues.

```tsx
// ❌ Manual synchronization nightmare
function UserSettings() {
   const [theme, setTheme] = useState('light')

   // Load from localStorage on mount
   useEffect(() => {
      const saved = localStorage.getItem('theme')
      if (saved) {
         try {
            setTheme(JSON.parse(saved))
         } catch (error) {
            console.error('Failed to parse theme from localStorage')
         }
      }
   }, [])

   // Save to localStorage on every change
   useEffect(() => {
      localStorage.setItem('theme', JSON.stringify(theme))
   }, [theme])

   return (
      <select
         value={theme}
         onChange={(e) => {
            setTheme(e.target.value)

            // Or do this manually to sync with localStorage
            // localStorage.setItem('theme', JSON.stringify(theme))
         }}
      >
         <option value='light'>Light</option>
         <option value='dark'>Dark</option>
      </select>
   )
}
```

---

**Solution:-** This hook provides automatic bidirectional synchronization between React state and localStorage with a single line of code.

It's designed to be a drop-in replacement for `useState`, maintaining the familiar API.

```tsx
// ✅ Automatic synchronization
function UserSettings() {
   const [theme, setTheme] = useLocalStorage({ key: 'theme', initialValue: 'light' })

   return (
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
         <option value='light'>Light</option>
         <option value='dark'>Dark</option>
      </select>
   )
}
```

:::
::: details Inconsistent useState API Compatibility

---

**Problem:-** Custom localStorage solutions often don't maintain the familiar `useState` API, breaking developer expectations and existing code patterns.

```tsx
// ❌ Non-standard API breaks familiar patterns
function BrokenComponent() {
   const [count, updateCount] = someLocalStorageHook('count', 0)

   // This doesn't work because updateCount doesn't support function updates
   updateCount((prev) => prev + 1) // ❌ TypeError

   // Forced to use unfamiliar patterns
   updateCount(count + 1) // ❌ Race condition risk
}
```

---

**Solution:-** This hook maintains 100% API compatibility with useState, including support for functional updates and previous value callbacks.

```tsx
// ✅ Perfect useState compatibility
function Component() {
   const [count, setCount] = useLocalStorage({ key: 'count', initialValue: 0 })

   // All familiar useState patterns work perfectly
   setCount(5) // Direct value
   setCount((prev) => prev + 1) // Functional update
   setCount((c) => c * 2) // Previous value callback
}
```

:::

::: details Server-Side Rendering Compatibility Issues

---

**Problem:-** Direct localStorage access during SSR causes `hydration mismatches` and crashes because localStorage isn't available on the server.

```tsx
// ❌ SSR/hydration nightmare
function ProblematicComponent() {
   const [theme, setTheme] = useState(() => {
      return localStorage.getItem('theme') || 'light' // ❌ Crashes during SSR
   })

   // Hydration mismatch: server renders 'light', client might render 'dark'
}
```

---

**Solution:-** The hook's `initialValue` prop ensures consistent initial renders and smooth hydration by providing predictable fallback values.

```tsx
// ✅ SSR-compatible with smooth hydration
function SSRFriendlyComponent() {
   const [theme, setTheme] = useLocalStorage({
      key: 'theme',
      initialValue: 'light', // Used during SSR and as fallback
   })

   // Server and client both start with 'light'
   // Client hydrates smoothly, then updates from localStorage
}
```

:::

::: details Lack of Type Safety

---

**Problem:-** localStorage operations are inherently `untyped`, leading to runtime errors and `unpredictable` behavior when data types don't match expectations.

```tsx
// ❌ No type safety leads to runtime errors
function UnsafeComponent() {
   const [settings, setSettings] = useState()

   useEffect(() => {
      const saved = localStorage.getItem('settings')
      setSettings(JSON.parse(saved)) // Could be anything!
   }, [])

   // Runtime error if settings isn't the expected shape
   return <div>{settings.theme.mode}</div> // ❌ Potential crash
}
```

---

**Solution:-** The hook provides full TypeScript support with generic type parameters that ensure type safety throughout the application.

```tsx
// ✅ Full type safety with TypeScript generics
interface UserSettings {
   theme: 'light' | 'dark'
   language: 'en' | 'es' | 'fr'
   notifications: boolean
}

function SafeComponent() {
   const [settings, setSettings] = useLocalStorage<UserSettings>({
      key: 'user-settings',
      initialValue: { theme: 'light', language: 'en', notifications: true },
   })

   // TypeScript ensures settings has the correct shape
   return <div>{settings.theme}</div> // ✅ Type-safe access

   // TypeScript prevents invalid updates
   setSettings({ theme: 'blue' }) // ❌ TypeScript error: 'blue' not assignable
}
```

:::

::: details Lack of Data Security and Transformation

---

**Problem:-** Sensitive data stored in localStorage is visible in plain text, and there's no built-in way to transform or compress data before storage.

```tsx
// ❌ Sensitive data exposed in plain text
function InsecureComponent() {
   const [apiKey, setApiKey] = useLocalStorage({ key: 'api-key', initialValue: '' })

   // API key stored as plain text in localStorage - anyone can read it!
   // No way to compress large data structures
}
```

---

**Solution:-** The hook supports optional `encoder` and `decoder` functions for custom data transformation like encryption, compression, or Base64 encoding.

```tsx
// ✅ Encrypted storage with custom encoder/decoder
function SecureComponent() {
   const [apiKey, setApiKey] = useLocalStorage({
      key: 'api-key',
      initialValue: '',
      encoder: (value) => btoa(value), // Base64 encode
      decoder: (value) => atob(value), // Base64 decode
   })

   // Or use real encryption
   const [sensitiveData, setSensitiveData] = useLocalStorage({
      key: 'sensitive',
      initialValue: {},
      encoder: (value) => encryptData(value), // Your encryption function
      decoder: (value) => decryptData(value), // Your decryption function
   })
}
```

:::

## Parameters

| Parameter    |           Type            | Required | Default Value | Description                                                  |
| ------------ | :-----------------------: | :------: | :-----------: | ------------------------------------------------------------ |
| key          |          string           |    ✅    |       -       | Unique key for localStorage item                             |
| initialValue |  State \| (() => State)   |    ❌    |   undefined   | Initial value when no stored value exists                    |
| encoder      | (value: string) => string |    ❌    |   undefined   | Optional function to encode stringified value before storing |
| decoder      | (value: string) => string |    ❌    |   undefined   | Optional function to decode stored value before parsing      |

## Return Value(s)

Returns a tuple `[state, setState]` similar to `useState`:

| Index | Type                                | Description                                                                  |
| ----- | ----------------------------------- | ---------------------------------------------------------------------------- |
| 0     | State                               | Current state value from localStorage                                        |
| 1     | Dispatch\<SetStateAction\<State\>\> | Function to update state (supports both direct values and updater functions) |

## Common Use Cases

-  Theme preferences (dark/light mode)
-  Form draft saving (auto-save functionality)
-  Shopping cart persistence
-  User settings and preferences
-  Feature flags for application
-  Encrypted/encoded sensitive data storage
-  Compressed data for large objects

## Usage Examples

### Basic User Preferences

```ts {4,5,9,14}
import { useLocalStorage } from 'classic-react-hooks'

function UserPreferences() {
   const [theme, setTheme] = useLocalStorage({ key: 'theme', initialValue: 'light' })
   const [language, setLanguage] = useLocalStorage({ key: 'language', initialValue: 'en' })

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

### Complex Object State

::: details

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
      initialValue: {
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

:::

### Encoded/Encrypted Storage

::: details

```ts
// Base64 encoding example
function Base64Example() {
   const [token, setToken] = useLocalStorage({
      key: 'auth-token',
      initialValue: '',
      encoder: (value) => btoa(value), // Encode to Base64
      decoder: (value) => atob(value), // Decode from Base64
   })

   return <input type='text' value={token} onChange={(e) => setToken(e.target.value)} placeholder='Enter token' />
}

// Custom encryption example (pseudo-code)
function EncryptedStorage() {
   const encrypt = (value: string) => {
      // Your encryption logic (e.g., AES)
      return CryptoJS.AES.encrypt(value, 'secret-key').toString()
   }

   const decrypt = (value: string) => {
      // Your decryption logic
      const bytes = CryptoJS.AES.decrypt(value, 'secret-key')
      return bytes.toString(CryptoJS.enc.Utf8)
   }

   const [sensitiveData, setSensitiveData] = useLocalStorage({
      key: 'sensitive-info',
      initialValue: { apiKey: '', secret: '' },
      encoder: encrypt,
      decoder: decrypt,
   })

   return (
      <div>
         <input
            type='password'
            value={sensitiveData.apiKey}
            onChange={(e) => setSensitiveData((prev) => ({ ...prev, apiKey: e.target.value }))}
            placeholder='API Key'
         />
      </div>
   )
}

// Compression example using pako library
function CompressedStorage() {
   const compress = (value: string) => {
      return pako.deflate(value, { to: 'string' })
   }

   const decompress = (value: string) => {
      return pako.inflate(value, { to: 'string' })
   }

   const [largeData, setLargeData] = useLocalStorage({
      key: 'large-dataset',
      initialValue: [],
      encoder: compress,
      decoder: decompress,
   })

   // Useful for storing large arrays or objects
}
```

:::

## Data Flow

The encoding and decoding process follows this flow:

**Storing data:**

```
State → JSON.stringify() → encoder() → localStorage
```

**Retrieving data:**

```
localStorage → decoder() → JSON.parse() → State
```

Note: The encoder operates on the JSON-stringified value, and the decoder operates before JSON parsing.
