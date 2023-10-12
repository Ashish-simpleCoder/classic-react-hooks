import './tailwind.postcss'
import {Tabs, Tab} from 'vue3-tabs-component';
import DefaultTheme from 'vitepress/theme'
import "./tabs.css";

export default { ...DefaultTheme,enhanceApp({ app, router, siteData }) {
   app.component('tabs', Tabs);
   app.component('tab', Tab);
}, }