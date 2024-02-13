import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
   lang: 'en-US',
   title: 'React Hooks',
   description: 'All in one place for awesome react-hooks',

   lastUpdated: true,
   cleanUrls: true,

   sitemap: {
      hostname: 'https://classic-react-hooks.vercel.app',
      transformItems(items) {
        return items.filter((item) => !item.url.includes('migration'))
      }
    },

   themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: '/logo.jpg',

      nav: [
         { text: 'Home', link: '/' },
         { text: 'Hooks', link: '/hooks/use-synced-ref' },
      ],

      search: {
         provider: 'local',
      },

      sidebar: {
         '/': { base: '/', items: sidebarGuide() },
      },

      socialLinks: [{ icon: 'github', link: 'https://github.com/Ashish-simpleCoder/classic-react-hooks' }],
      editLink: {
         pattern: "https://github.com/Ashish-simpleCoder/classic-react-hooks/edit/main/doc/:path",
         text: "Edit this page on GitHub",
       },

       footer: {
         message:
           "Crafted by <a href='https://github.com/ashish-simpleCoder' target='_blank'>Ashish Prajapati</a>",
         copyright: "Powered by VitePress",
       },
   },

})

/* prettier-ignore */
function sidebarGuide(): DefaultTheme.SidebarItem[] {
   return [
      {
         text: "Getting Started",
         collapsed: false,
         items: [
            { base: "/getting-started", text: "Overview", link: "/overview" },
         ],
      },
      {
         text: 'Hooks',
         collapsed: false,
         base: "/hooks/",
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
            { text: 'useCounter', link: 'use-counter' },
         ]
      },
   ]
}
