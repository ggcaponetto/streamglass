# StreamGlass: Desktop

This is the desktop application that controls your computer.

| Statements                  | Branches                | Functions                 | Lines             |
| --------------------------- | ----------------------- | ------------------------- | ----------------- |
| ![Statements](https://img.shields.io/badge/statements-0%25-red.svg?style=flat) | ![Branches](https://img.shields.io/badge/branches-28.57%25-red.svg?style=flat) | ![Functions](https://img.shields.io/badge/functions-28.57%25-red.svg?style=flat) | ![Lines](https://img.shields.io/badge/lines-0%25-red.svg?style=flat) |

## Developing with WSL

To run electron on WSL2 we need some dependencies. For a standard ubuntu installation the following command should work:

```bash
sudo apt install libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss-dev
```

Check out more [wsl quirks](https://www.electronforge.io/guides/developing-with-wsl) here.

If you're using Windows Subsystem for Linux (WSL), there are some quirks to running Electron apps. Since you can run a mostly complete Linux distribution inside it, it justifiably declares itself as Linux when you're inside of it. However, as of February 2021 there is no support for running graphical apps compiled for Linux out of the box. Simply trying to run an Electron app in development that you've installed dependencies in WSL will try and fail to find an X11 server, and thus not launch.

Fortunately, one of the features of WSL is that you can run Windows executables from a WSL terminal seamlessly. The caveat is that you'll need to reinstall Electron in order to pick up the prebuilt binaries for Windows instead of Linux. Inside a WSL terminal, assuming that you've installed Node.js for Linux, you can run:

```bash
# If node_modules exists already that was installed in WSL:

rm -r node_modules

# then:

npm install --platform=win32

# or:

npm_config_platform=win32 npm install
```
