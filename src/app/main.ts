import { app, BrowserWindow, globalShortcut } from 'electron';
import { updateElectronApp } from 'update-electron-app';
import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('did-fail-load', () => {
        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
        }
        else {
            mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
        }
    });

    updateElectronApp()
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

app.on('browser-window-focus', () => {
    // globalShortcut.register("CommandOrControl+Shift+R", () => {
    //     console.log("CommandOrControl+Shift+R is pressed: Shortcut Disabled");
    // });

    // globalShortcut.register("CommandOrControl+R", () => {
    //     console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    // });

    // globalShortcut.register("F5", () => {
    //     console.log("F5 is pressed: Shortcut Disabled");
    // });
})

app.on('browser-window-blur', () => {
    // globalShortcut.unregister('CommandOrControl+R');
    // globalShortcut.unregister('F5');
})

// autoUpdater.on('update-available', () => {
//     console.log('update-available')
// })

// autoUpdater.on('update-downloaded', () => {
//     console.log('update-downloaded')
// })

// autoUpdater.on('update-not-available', () => {
//     console.log('update-not-available')
// })

// autoUpdater.on('error', (e) => {
//     console.log('error', e)
// })