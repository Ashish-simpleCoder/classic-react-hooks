import {
  Fragment,
  computed,
  createBaseVNode,
  createElementBlock,
  defineComponent,
  inject,
  normalizeClass,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  openBlock,
  provide,
  reactive,
  ref,
  renderList,
  renderSlot,
  toRefs,
  unref,
  vShow,
  watch,
  withDirectives
} from "./chunk-67UUJLDS.js";
import "./chunk-76J2PTFD.js";

// node_modules/.pnpm/vue3-tabs-component@1.3.6_vue@3.3.4/node_modules/vue3-tabs-component/dist/vue3-tabs-component.mjs
var x = Symbol("addTab");
var k = Symbol("updateTab");
var y = Symbol("deleteTab");
var A = Symbol("tabsProvider");
function m(n, c) {
  const a = inject(n, c);
  if (typeof a > "u")
    throw new Error(`Could not resolve ${n.description}`);
  return a;
}
var J = ["data-tab-id", "aria-hidden"];
var W = defineComponent({
  __name: "Tab",
  props: {
    panelClass: { default: "tabs-component-panel" },
    id: { default: void 0 },
    name: null,
    prefix: { default: "" },
    suffix: { default: "" },
    isDisabled: { type: Boolean, default: false },
    navItemClass: { default: void 0 },
    navItemLinkClass: { default: void 0 }
  },
  setup(n, { expose: c }) {
    const a = n, i = ref(false), s = m(A), u = m(x), d = m(k), r = m(y), t = a.prefix + a.name + a.suffix, l = a.id ? a.id : a.name.toLowerCase().replace(/ /g, "-"), e = l + "-pane", o = computed(() => "#" + (a.isDisabled ? "" : l));
    return watch(
      () => s.activeTabHash,
      () => {
        i.value = o.value === s.activeTabHash;
      }
    ), watch(
      () => Object.assign({}, a),
      () => {
        d(l, {
          name: a.name,
          header: a.prefix + a.name + a.suffix,
          isDisabled: a.isDisabled,
          hash: o.value,
          index: s.tabs.length,
          computedId: l,
          paneId: e,
          navItemClass: a.navItemClass,
          navItemLinkClass: a.navItemLinkClass
        });
      }
    ), onBeforeMount(() => {
      u({
        name: a.name,
        header: t,
        isDisabled: a.isDisabled,
        hash: o.value,
        index: s.tabs.length,
        computedId: l,
        paneId: e,
        navItemClass: a.navItemClass,
        navItemLinkClass: a.navItemLinkClass
      });
    }), onBeforeUnmount(() => {
      r(l);
    }), c({
      header: t,
      computedId: l,
      paneId: e,
      hash: o,
      isActive: i
    }), (f, I) => withDirectives((openBlock(), createElementBlock("section", {
      ref: "tab",
      id: e,
      "data-tab-id": unref(l),
      "aria-hidden": !i.value,
      class: normalizeClass(n.panelClass),
      role: "tabpanel",
      tabindex: "-1"
    }, [
      renderSlot(f.$slots, "default")
    ], 10, J)), [
      [vShow, i.value]
    ]);
  }
});
var z = class {
  get(c) {
    const a = localStorage.getItem(c);
    if (a === null)
      return null;
    const i = JSON.parse(a);
    return i ? new Date(i.expires) < /* @__PURE__ */ new Date() ? (localStorage.removeItem(c), null) : i.value : null;
  }
  set(c, a, i) {
    const s = (/* @__PURE__ */ new Date()).getTime(), u = new Date(s + i * 6e4);
    localStorage.setItem(c, JSON.stringify({ value: a, expires: u }));
  }
};
var w = new z();
var R = ["id"];
var V = ["aria-controls", "aria-selected", "href", "onClick", "innerHTML"];
var q = defineComponent({
  __name: "Tabs",
  props: {
    id: { default: void 0 },
    cacheLifetime: { default: 5 },
    options: { default: () => ({
      useUrlFragment: true,
      defaultTabHash: void 0,
      storageKey: void 0
    }) },
    wrapperClass: { default: "tabs-component" },
    panelsWrapperClass: { default: "tabs-component-panels" },
    navClass: { default: "tabs-component-tabs" },
    navItemClass: { default: "tabs-component-tab" },
    navItemDisabledClass: { default: "is-disabled" },
    navItemActiveClass: { default: "is-active" },
    navItemInactiveClass: { default: "is-inactive" },
    navItemLinkClass: { default: "tabs-component-tab-a" },
    navItemLinkActiveClass: { default: "is-active" },
    navItemLinkInactiveClass: { default: "is-inactive" },
    navItemLinkDisabledClass: { default: "is-disabled" }
  },
  emits: ["changed", "clicked"],
  setup(n, { expose: c, emit: a }) {
    const i = n, s = reactive({
      activeTabHash: "",
      lastActiveTabHash: "",
      tabs: []
    });
    provide(A, s), provide(x, (t) => {
      s.tabs.push(t);
    }), provide(k, (t, l) => {
      const e = s.tabs.findIndex((o) => o.computedId === t);
      l.isActive = s.tabs[e].isActive, s.tabs[e] = l;
    }), provide(y, (t) => {
      const l = s.tabs.findIndex((e) => e.computedId === t);
      s.tabs.splice(l, 1);
    });
    const u = computed(
      () => {
        let t;
        return i.options.storageKey && (t = i.options.storageKey), !t && i.id && (t = `vue-tabs-component.${i.id}.cache.${window.location.host}${window.location.pathname}`), t || (t = `vue-tabs-component.cache.${window.location.host}${window.location.pathname}`), t;
      }
    ), d = (t, l) => {
      l && !i.options.useUrlFragment && l.preventDefault();
      const e = r(t);
      if (!!e) {
        if (l && e.isDisabled) {
          l.preventDefault();
          return;
        }
        if (s.lastActiveTabHash === e.hash) {
          a("clicked", { tab: e });
          return;
        }
        s.tabs.forEach((o) => {
          o.isActive = o.hash === e.hash;
        }), a("changed", { tab: e }), s.lastActiveTabHash = s.activeTabHash = e.hash, !(i.cacheLifetime <= 0) && w.set(u.value, e.hash, i.cacheLifetime);
      }
    }, r = (t) => s.tabs.find((l) => l.hash === t);
    return onMounted(() => {
      if (!!s.tabs.length) {
        if (window.addEventListener("hashchange", () => d(window.location.hash)), r(window.location.hash)) {
          d(window.location.hash);
          return;
        }
        if (i.cacheLifetime > 0) {
          const t = w.get(u.value);
          if (t !== null && r(t)) {
            d(t);
            return;
          }
          if (i.options.defaultTabHash && r("#" + i.options.defaultTabHash)) {
            d("#" + i.options.defaultTabHash);
            return;
          }
        }
        d(s.tabs[0].hash);
      }
    }), c({
      ...toRefs(s),
      selectTab: d,
      findTab: r
    }), (t, l) => (openBlock(), createElementBlock("div", {
      class: normalizeClass(n.wrapperClass),
      id: n.id
    }, [
      createBaseVNode("ul", {
        role: "tablist",
        class: normalizeClass(n.navClass)
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(s.tabs, (e, o) => {
          var f, I;
          return openBlock(), createElementBlock("li", {
            key: o,
            class: normalizeClass([
              (f = e.navItemClass) != null ? f : n.navItemClass,
              e.isDisabled ? n.navItemDisabledClass : "",
              e.isActive ? n.navItemActiveClass : e.isDisabled ? "" : n.navItemInactiveClass
            ]),
            role: "presentation"
          }, [
            createBaseVNode("a", {
              role: "tab",
              class: normalizeClass([
                (I = e.navItemLinkClass) != null ? I : n.navItemLinkClass,
                e.isDisabled ? n.navItemLinkDisabledClass : "",
                e.isActive ? n.navItemLinkActiveClass : e.isDisabled ? "" : n.navItemLinkInactiveClass
              ]),
              "aria-controls": e.paneId,
              "aria-selected": e.isActive,
              href: e.hash,
              onClick: (S) => d(e.hash, S),
              innerHTML: e.header,
              tabindex: "0"
            }, null, 10, V)
          ], 2);
        }), 128))
      ], 2),
      createBaseVNode("div", {
        class: normalizeClass(n.panelsWrapperClass)
      }, [
        renderSlot(t.$slots, "default")
      ], 2)
    ], 10, R));
  }
});
var Q = {
  install(n) {
    n.component("tab", W), n.component("tabs", q);
  }
};
export {
  W as Tab,
  q as Tabs,
  Q as default
};
//# sourceMappingURL=vue3-tabs-component.js.map
