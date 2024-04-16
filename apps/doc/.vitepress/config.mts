import { defineConfig, type DefaultTheme } from 'vitepress'
import { version } from '../../../package.json'

// https://vitepress.dev/reference/site-config
export default defineConfig({
   lang: 'en-US',
   title: 'classic-react-hooks',
   description: 'An awesome collection of custom React hooks',

   lastUpdated: true,
   cleanUrls: true,

   sitemap: {
      hostname: 'https://classic-react-hooks.vercel.app',
      transformItems(items) {
         return items.filter((item) => !item.url.includes('migration'))
      },
   },

   themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: '/logo.svg',

      nav: [
         {
            text: 'Home',
            link: '/',
         },
         {
            text: 'API',
            link: '/hooks/use-synced-ref',
         },
         {
            text: `v${version}`,
            link: `https://github.com/Ashish-simpleCoder/classic-react-hooks/releases/tag/v${version}`,
         },
      ],

      search: {
         provider: 'local',
      },

      sidebar: {
         '/': {
            base: '/',
            items: sidebarGuide(),
         },
      },

      socialLinks: [
         {
            icon: 'github',
            link: 'https://github.com/Ashish-simpleCoder/classic-react-hooks',
         },
         { icon: 'x', link: 'https://twitter.com/ashish_devloper' },
         { icon: 'linkedin', link: 'https://linkedin.com/in/ashish-prajapati-002154193' },
      ],
      editLink: {
         pattern: 'https://github.com/Ashish-simpleCoder/classic-react-hooks/edit/main/doc/:path',
         text: 'Edit this page on GitHub',
      },

      footer: {
         message:
            "Released under the MIT License.\n Crafted by <a href='https://github.com/ashish-simpleCoder' target='_blank'>Ashish Prajapati</a>",
         copyright: 'Powered by VitePress',
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
         text: 'API',
         collapsed: false,
         base: "/hooks/",
         items: [
            { text: 'use-event-listener', link: 'use-event-listener' },
            { text: 'use-copy-to-clipboard', link: 'use-copy-to-clipboard' },
            { text: 'use-local-storage', link: 'use-local-storage' },
            { text: 'use-outside-click', link: 'use-outside-click' },
            { text: 'use-debounded-fn', link: 'use-debounced-fn' },
            { text: 'use-is-online', link: 'use-is-online' },
            { text: 'use-timeout-effect', link: 'use-timeout-effect' },
            { text: 'use-interval-effect', link: 'use-interval-effect' },
            { text: 'use-synced-ref', link: 'use-synced-ref' },
            { text: 'use-synced-effect', link: 'use-synced-effect' },
            { text: 'use-on-mount-effect', link: 'use-on-mount-effect' },
            { text: 'use-counter', link: 'use-counter' },
         ]
      },
   ]
}
