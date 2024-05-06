# Contributing Guide

Hi! We are really excited that you are interested in contributing to classic-react-hooks. Before submitting your contribution, please make sure to take a moment and read through the following guide:

## Repo Setup

The package manager used to install and link dependencies should be [pnpm](https://pnpm.io/) v8.12.0 or higher. NodeJS version should be v18.14.2 or higher

1. Run `pnpm install` in root folder

2. Run `pnpm run build` to build the package

3. Run `pnpm run test` to run the test cases

4. Run `pnpm run format` to format all of the coding with prettier

## Pull Request Guidelines

-  Checkout a topic branch from a base branch, e.g. `main`, and merge back against that branch.

-  If adding a new feature:

   -  Add accompanying test case.
   -  Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

-  If fixing bug:

   -  If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `fix: update fetch logic (fix #3899)`.
   -  Provide a detailed description of the bug in the PR. Live demo preferred.
   -  Add appropriate test coverage if applicable.

-  It's OK to have multiple small commits as you work on the PR - GitHub can automatically squash them before merging.

-  Make sure tests pass!

-  Use `pnpm format` to format files according to the project guidelines.

## Documenation Guidelines

-  To contribute in the documentation, go to apps/doc directory

1. Run `pnpm install` to install all of the dependencies

2. Run `pnpm docs:dev` for development of doc

3. Run `pnpm docs:build` for building the prodution version of doc

4. Run `pnpm docs:preview` to see the preview of doc
