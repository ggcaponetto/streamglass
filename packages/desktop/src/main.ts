import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import {
    registerEventHandler,
    removeEventHandler,
} from './components/event-handler/event-handler';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

const isDevelopment = process.env.NODE_ENV === 'development';
console.log(`The main.ts is running in ${process.env.NODE_ENV} mode.`);
const preloadScriptPath = path.join(__dirname, 'preload.js');
console.log(`The preload.js file is situated on ${preloadScriptPath}`);

const channels = ['sg-event'];

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    channels.forEach((channel) => {
        removeEventHandler(channel);
    });
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 500,
        height: 250,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
            )
        );
    }

    // Open the DevTools.
    if (isDevelopment) {
        mainWindow.webContents.openDevTools();
    }

    nativeTheme.themeSource = 'dark';
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        channels.forEach((channel) => {
            removeEventHandler(channel);
        });
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

channels.forEach((channel) => {
    registerEventHandler(channel);
});
