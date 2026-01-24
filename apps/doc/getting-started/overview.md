# Overview

**_`classic-react-hooks`_** is a lightweight yet robust library of custom React hooks and components designed to simplify and streamline everyday development tasks.

It promotes _`clean`_, _`declarative`_, _`modular`_, and _`predictable`_ code, making applications easier to maintain and scale as they grow.

Built with `TypeScript` and a strong emphasis on type safety, the library is _`minimal`_, _`tree-shakable`_, and optimized for modern React applications. All hooks are fully compatible with server-side rendering _`(SSR)`_, ensuring no hydration mismatches.

The library is thoroughly tested using _`Vitest`_ and _`React-Testing-Library`_, covering a wide range of use cases. Contributions of additional test cases are always welcome.

## Motivation

**_`classic-react-hooks`_** is designed to provide a _`focused`_, _`predictable`_, and _`developer-friendly`_ set of React hooks that prioritize clarity, consistency, and long-term maintainability. The library emphasizes stable APIs, minimal abstractions, and practical flexibility, allowing developers to reason about behavior with confidence while building scalable applications.

In contrast, many existing hook libraries tend to focus on highly specialized use cases or offer broad collections of hooks that may not be universally applicable. Some primarily act as abstractions over smaller utility libraries, introducing additional layers of indirection without delivering proportional architectural value.

These libraries often expose _`distinct APIs`_ for individual hooks, favoring _`syntactic brevity`_ over _`predictability`_ and _`consistency`_. While this can reduce boilerplate, it may also lead to APIs that are harder to internalize, less consistent in behavior, and more constrained in real-world usage.

Additionally, a common pattern among such libraries is a _`heavy reliance`_ on **useEffect**, **useCallback**, and **useMemo** for state tracking, function memoization, and lifecycle management. This frequently places the burden of dependency management and _`stale-closure`_ prevention on developers, potentially resulting in unnecessary _`re-renders`_, increased computational overhead, and more complex performance tuning.

As a result, development effort often shifts away from building features toward managing library-specific APIs. **_`classic-react-hooks`_** aims to minimize this cognitive load, enabling developers to focus on delivering features rather than adapting to complex or inconsistent abstractions.

## What `classic-react-hooks` offers

-  A thoughtfully curated set of feature-rich hooks
-  High performance with a minimal and lightweight footprint
-  Predictable and intuitive API behavior through natural usage
-  Built with TypeScript, prioritizing strong type safety
-  Zero third-party dependencies
-  Modular and declarative design principles
-  Fully tree-shakable for optimal bundling
-  Comprehensive and well-structured documentation

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
