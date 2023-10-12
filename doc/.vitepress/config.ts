import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
   title: 'React Hooks',
   description: 'React Hooks',
   base: '/classic-react-hooks/',
   themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
         { text: 'Home', link: '/' },
         { text: 'Guide Book', link: '/guide/use-synced-ref' },
      ],
      sidebar: {
         '/guide/use-synced-ref': { base: '/guide/', items: sidebarGuide() },
      },
      socialLinks: [{ icon: 'github', link: 'https://github.com/ashish-simpleCoder' }],
   },
})

/* prettier-ignore */
function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Hooks',
      collapsed: false,
      items: [
        { text: 'useSyncedRef', link: 'use-synced-ref' },
        { text: 'useDeboundedFn', link: 'use-debounced-fn' },
        { text: 'useEventListener', link: 'use-event-listener' },
        { text: 'useFetch', link: 'use-fetch' },
        { text: 'useIntervalEffect', link: 'use-interval-effect' },
        { text: 'useTimeoutEffect', link: 'use-timeout-effect' },
        { text: 'useIsOnline', link: 'use-is-online' },
        { text: 'usePagination', link: 'use-pagination' },
        { text: 'useOnMountEffect', link: 'use-on-mount-effect' },
        { text: 'useSyncedEffect', link: 'use-synced-effect' },
        { text: 'useLocalStorage', link: 'use-local-storage' },
        { text: 'useOutsideClick', link: 'use-outside-click' },
        { text: 'useStateHistory', link: 'use-state-history' },
        { text: 'useKeysEventListener', link: 'use-keys-event-listener' },
      ]
    },
  ]
}
