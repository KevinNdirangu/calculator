const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let mainWindow;

// Configure logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.whenReady().then(() => {
        mainWindow = new BrowserWindow({
            width: 350,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        });

        mainWindow.loadFile("calculator.html");

        // Check for updates
        autoUpdater.checkForUpdatesAndNotify();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });

    // Auto-update event handlers
    autoUpdater.on("checking-for-update", () => {
        log.info("Checking for update...");
    });

    autoUpdater.on("update-available", (info) => {
        log.info(`Update available: Version ${info.version}`);
        dialog.showMessageBox({
            type: "info",
            title: "Update Available",
            message: "A new update is available. Downloading now...",
        });
    });

    autoUpdater.on("update-not-available", () => {
        log.info("No update available.");
    });

    autoUpdater.on("error", (err) => {
        log.error(`Update error: ${err.message}`);
    });

    autoUpdater.on("update-downloaded", () => {
        log.info("Update downloaded. Restarting...");
        dialog
            .showMessageBox({
                type: "info",
                title: "Update Ready",
                message: "Update downloaded. The app will restart now to apply updates.",
            })
            .then(() => {
                autoUpdater.quitAndInstall();
            });
    });
}
