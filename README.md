<!-- Source: ./README_MONOREPO_ROOT.md -->

# StreamGlass


![example branch parameter](https://github.com/ggcaponetto/streamglass/actions/workflows/main.yml/badge.svg?branch=main)
![status: pre-alpha](https://img.shields.io/badge/pre--alpha-active_development-green)

<p align="center">
  <img src="./packages/frontend/public/assets/logo/logo-transparent.png" width="150" alt="Logo">
</p>

> 🚧 **Development Notice**: This repository is in an **early development phase** (pre-alpha). Expect frequent and potentially breaking changes. Not ready for production or general use but your feedback is more than welcome.

Streamer utilities for Twitch/OBS and any other software. Control your workstation with any device, from anywhere.
You can read more on the user documentation hosted on [https://docs.streamglass.io](https://docs.streamglass.io).

The streamglass project is organized as a monorepo.

- [StreamGlass: Frontend](./packages/frontend/README.md) - Available on [https://app.streamglass.io](https://app.streamglass.io)
- [StreamGlass: Server](./packages/server/README.md) - Available on [https://backend.streamglass.io](https://backend.streamglass.io)
- [StreamGlass: Utilities](./packages/sg-utilities/README.md)
- [StreamGlass: Desktop](./packages/desktop/README.md)

## Getting Started

```bash
# Install all dependencies
npm i
# Transpile the sg-uitlities library
npm tsc:build
# Start the server, desktop and frontend app in development mode.
npm run start
```

To build the electron deskop app, run:

```bash
npm run make
```

The binary can be found in `packages/desktop/out`.


<!-- Source: ./packages/frontend/README.md -->

## StreamGlass: Frontend

This is the main web-application.

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-0.68%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-14.28%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-14.28%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-0.68%25-red.svg?style=flat) |


<!-- Source: ./packages/server/README.md -->

## StreamGlass: Server

This is an optional server component that provides additional functionalities.

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-81.07%25-yellow.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-81.81%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-93.75%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-81.07%25-yellow.svg?style=flat) |


<!-- Source: ./packages/sg-utilities/README.md -->

## Stramglass: Utilities

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-98.21%25-brightgreen.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-88.88%25-yellow.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-98.21%25-brightgreen.svg?style=flat) |

Utility to concatenate mardown files.

Usage:

```bash
md-concat -i <files...> -o <output> [-s <shift>]

Options:
      --version  Show version number                                   [boolean]
  -i, --input    Input markdown files                         [array] [required]
  -o, --output   Output file path                            [string] [required]
  -s, --shift    Heading shift level                       [number] [default: 1]
      --help     Show help                                             [boolean]
```

```bash
tsx packages/sg-utilities/src/markdown-util.ts --input ./README_MONOREPO_ROOT.md ./packages/frontend/README.md ./packages/server/README.md ./packages/sg-utilities/README.md --output ./README.md
```


<!-- Source: ./packages/desktop/README.md -->

## StreamGlass: Desktop

This is the desktop application that controls your computer.

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-0%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-45.45%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-45.45%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-0%25-red.svg?style=flat) |

### Developing with WSL

To run electron on WSL2 we need some dependencies. For a standard ubuntu installation the following command should work:

```bash
sudo apt install libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss-dev
```

Check out more [wsl quirks](https://www.electronforge.io/guides/developing-with-wsl) here.

If you're using Windows Subsystem for Linux (WSL), there are some quirks to running Electron apps. Since you can run a mostly complete Linux distribution inside it, it justifiably declares itself as Linux when you're inside of it. However, as of February 2021 there is no support for running graphical apps compiled for Linux out of the box. Simply trying to run an Electron app in development that you've installed dependencies in WSL will try and fail to find an X11 server, and thus not launch.

Fortunately, one of the features of WSL is that you can run Windows executables from a WSL terminal seamlessly. The caveat is that you'll need to reinstall Electron in order to pick up the prebuilt binaries for Windows instead of Linux. Inside a WSL terminal, assuming that you've installed Node.js for Linux, you can run:

```bash
## If node_modules exists already that was installed in WSL:

rm -r node_modules

## then:

npm install --platform=win32

## or:

npm_config_platform=win32 npm install
```

Also make sure to have installed these dependencies:

```bash
sudo apt install dpkg fakeroot rpm
```