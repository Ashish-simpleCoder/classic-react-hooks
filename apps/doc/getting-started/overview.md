# Overview

**_`classic-react-hooks`_** is a lightweight yet powerful library of custom _react-hooks_ and _components_ that streamline everyday development.

It encourages you to write _`clean`_, _`declarative`_, _`modular`_, and _`predictable`_ code that remains easy to maintain and scale as your project grows.

This library is written with Typescript having _`Type-Safety`_ in mind. It is _`Tree-Shakable`_ and `minimal` as much as possible. All of the hooks are fully compatible with _`SSR`_(no hydration mismatch) and have been tested with all possible test cases using _`Vitest`_ and _`React-Testing-Library`_ (new test cases contribution are welcomed).

## Motivation

Most of the hook libraries out there are specialized solution or packed with lots of unnecessary hooks. Some of them are just a wrapper on another mini-library. In which each hook introduces new _`syntax api`_ which mostly focuses on _`small syntax`_ and _`less lines of code`_ rather than _`Predictability`_, which results in _`Hard to remember syntax`_, _`Unpredictable API behaviours`_. And they are not so flexible either.

Pretty much all of the hooks just use too much of _`useEffect`_, _`useCallback`_ and _`useMemo`_ hooks for keeping track of values, functions and attaching-cleaning up the events. And sometimes you have to yourself memoize them and do a work around to fix stale-closure values inside those callback . Which is not always the great choice. Because it can cause lots of recalculation and effect trigger resulting in heavy memory and cpu usage.

Instead of building features you often have to focus more on learning the APIs, which becomes time consuming.

## What `classic-react-hooks` offers

-  Feature packed Hooks
-  Performant, Minimal and Lightweight
-  Predictable API Behaviours(just by using it)
-  Written in Typescript (Type-Safety in mind)
-  No Third Party Dependencies
-  Modular and Declarative
-  Tree-Shakable
-  Detailed Documentation

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
