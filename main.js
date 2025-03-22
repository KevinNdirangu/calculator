const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 350,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('calculator.html');

    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();
});

// Auto-update event handlers
autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Available',
        message: 'A new update is available. Downloading now...',
    });
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: 'Update downloaded. The app will restart now to apply updates.',
    }).then(() => {
        autoUpdater.quitAndInstall();
    });
});