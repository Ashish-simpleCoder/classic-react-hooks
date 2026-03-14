# Overview

**_`classic-react-hooks`_** is a lightweight yet robust collection of custom React hooks and components designed to simplify common development tasks without sacrificing clarity or control.

The library encourages _clean_, _declarative_, _modular_, and _predictable_ code, helping teams build applications that remain maintainable and scalable as complexity grows.

Built entirely with **TypeScript**, **`classic-react-hooks`** prioritizes strong type safety while remaining _minimal_, _tree-shakable_, and optimized for modern React environments. All hooks are fully compatible with server-side rendering _(SSR)_, ensuring consistent behavior and preventing hydration mismatches.

The library is thoroughly tested using **Vitest** and **React Testing Library**, covering a broad range of real-world use cases. Contributions—especially additional test cases—are always welcome.

## Motivation

**_`classic-react-hooks`_** exists to provide a _focused_, _predictable_, and _developer-friendly_ set of React hooks that emphasize clarity, consistency, and long-term maintainability.

Rather than offering a sprawling collection of narrowly scoped utilities, the library concentrates on stable, reusable primitives with minimal abstraction. APIs are designed to be easy to reason about, enabling developers to understand behavior intuitively and build scalable systems with confidence.

Many existing hook libraries prioritize syntactic brevity or highly specialized use cases. While this can reduce boilerplate, it often leads to fragmented APIs, inconsistent behavior, and abstractions that are difficult to internalize or adapt to real-world requirements. In some cases, these libraries merely wrap smaller utilities, adding layers of indirection without meaningful architectural benefit.

Another common pattern is a heavy reliance on **`useEffect`**, **`useCallback`**, and **`useMemo`** for state tracking and lifecycle control. This frequently shifts the burden of dependency management and stale-closure prevention onto developers, increasing cognitive load, introducing subtle bugs, and requiring unnecessary performance tuning.

**_`classic-react-hooks`_** aims to reverse this trend—reducing mental overhead and allowing developers to focus on building features instead of managing complex or inconsistent abstractions.

## What `classic-react-hooks` Offers

-  A carefully curated set of feature-rich, general-purpose hooks
-  High performance with a minimal and lightweight footprint
-  Predictable, intuitive APIs designed for natural usage
-  Strong TypeScript support with an emphasis on type safety
-  Zero third-party dependencies
-  Modular and declarative design principles
-  Fully tree-shakable for optimal bundling
-  Comprehensive, well-structured documentation

## Installation

::: code-group

```sh [npm]
$ npm install classic-react-hooks
```

```sh [pnpm]
$ pnpm add classic-react-hooks
```

```sh [deno]
$ deno install classic-react-hooks
```

```sh [yarn]
$ yarn add classic-react-hooks
```

```sh [bun]
$ bun add classic-react-hooks
```

:::
