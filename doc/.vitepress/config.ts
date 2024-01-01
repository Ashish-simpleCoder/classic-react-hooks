import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
   lang: 'en-US',
   title: 'React Hooks',
   description: 'All in one place for awesome react-hooks',

   lastUpdated: true,
   cleanUrls: true,

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
            { text: 'use-synced-ref', link: 'use-synced-ref' },
            { text: 'use-debounded-fn', link: 'use-debounced-fn' },
            { text: 'use-event-listener', link: 'use-event-listener' },
            // { text: 'use-fetch$', link: 'use-fetch' },
            { text: 'use-interval-effect', link: 'use-interval-effect' },
            { text: 'use-timeout-effect', link: 'use-timeout-effect' },
            { text: 'use-is-online', link: 'use-is-online' },
            // { text: 'use-pagination$', link: 'use-pagination' },
            { text: 'use-on-mount-effect', link: 'use-on-mount-effect' },
            { text: 'use-synced-effect', link: 'use-synced-effect' },
            { text: 'use-local-storage', link: 'use-local-storage' },
            // { text: 'use-outside-click$', link: 'use-outside-click' },
            // { text: 'use-state-history$', link: 'use-state-history' },
            // { text: 'use-keys-event-listener$', link: 'use-keys-event-listener' },
            { text: 'use-counter', link: 'use-counter' },
         ]
      },
   ]
}
