const { app, BrowserWindow, globalShortcut, Tray, screen, Menu, ipcMain, dialog, shell } = require('electron')
const fs = require('fs');
const path = require('path');

const { getStickers } = require('./getStickers.js');

function openSettings() {

    ipcMain.removeHandler('getStickers');
    ipcMain.handle('getStickers', () => {
      
        return getStickers();

    });
    ipcMain.removeHandler('getFilePath');
    ipcMain.handle('getFilePath', () => {
        let path = dialog.showOpenDialogSync({
            properties: ['openFile'],
            filters: [
                { name: 'Images', extensions: ['jpg', 'png', 'gif', 'webp'] },
            ]

        });
        console.log(path);
        return path;
    });
    ipcMain.removeHandler('openFolder');
    ipcMain.handle('openFolder', () => {
        shell.openPath(app.getPath('userData')+"\\stickers");
    });
    ipcMain.removeHandler('getAppPath');
    ipcMain.handle('getAppPath', () => {
        return app.getPath('userData');
    });

    win = new BrowserWindow({
        width: 450,
        height: 480,
        frame: true,
        x: 0, //2988
        y: 0, // 470
        icon: 'icon.ico',
        webPreferences: {
            preload: path.join(__dirname, 'settingsPreload.js'),
            nodeIntegration: true, // <--- flag
            nodeIntegrationInWorker: true, // <---  for web workers
            enableRemoteModule: true
        }
    })

    win.loadFile('src/settings.html')
}

module.exports = { openSettings }