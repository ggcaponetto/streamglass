<!-- Source: ./README_MONOREPO_ROOT.md -->

# StreamGlass

![example branch parameter](https://github.com/ggcaponetto/streamglass/actions/workflows/main.yml/badge.svg?branch=main)

Streaming layers and utilities for Twitch/OBS

The streamglass project is organized in a monorepo structure.

- [StreamGlass: Frontend](./packages/frontend/README.md)
- [StreamGlass: Server](./packages/server/README.md)

## Getting Started

Install the Vercel CLI

```bash
npm i -g vercel
```

Install all dependencies

```bash
npm install --workspaces
```

### Frontend

```bash
 npm run dev --workspace=frontend
```

### Server

```bash
 npm run start --workspace=server
```

## Testing

```bash
npm run test --workspaces
```


<!-- Source: ./packages/frontend/README.md -->

## StreamGlass: Frontend

This is the main web-application.


| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-0%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-0%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-0%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-0%25-red.svg?style=flat) |


<!-- Source: ./packages/server/README.md -->

## StreamGlass: Server

This is an optional server component that provides additional functionalities.

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-94.11%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-50%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-50%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-94.11%25-brightgreen.svg?style=flat) |


<!-- Source: ./packages/utilities/README.md -->

## Stramglass: Utilities

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-97.29%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-81.81%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-97.29%25-brightgreen.svg?style=flat) |

Utility to concatenate mardown files.

Usage:

```bash
npm run-script <command> [-- <args>]

Options:
[-w|--workspace <workspace-name> [-w|--workspace <workspace-name> ...]]
[-ws|--workspaces] [--include-workspace-root] [--if-present] [--ignore-scripts]
[--foreground-scripts] [--script-shell <script-shell>]
```