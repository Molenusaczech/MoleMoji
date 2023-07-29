const { app, BrowserWindow, globalShortcut, Tray, screen, Menu, ipcMain } = require('electron')
const fs = require('fs');
const path = require('path');
let win = undefined;

const dataPath = app.getPath('userData');


function openPoswiz() {

    console.log(dataPath);
    ipcMain.removeHandler('setPos');
    ipcMain.handle('setPos', () => {
        console.log('setPos ipc');
        console.log(win.getBounds());
        let config = JSON.parse(fs.readFileSync(dataPath+'/data/config.json', 'utf8'));
        config.position.x = win.getPosition()[0];
        config.position.y = win.getPosition()[1];
        config.position.w = win.getBounds()["width"];
        config.position.h = win.getBounds()["height"];
        fs.writeFileSync(dataPath+'/data/config.json', JSON.stringify(config, null, 2));
        win.close();
    });

    const config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'));
    win = new BrowserWindow({
        width: config.position.w,
        height: config.position.h,
        frame: true,
        x: config.position.x, //2988
        y: config.position.y, // 470
        icon: 'icon.ico',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'poswizPreload.js'),
            nodeIntegration: true, // <--- flag
            nodeIntegrationInWorker: true, // <---  for web workers
            enableRemoteModule: true
        }
    })
    win.menuBarVisible = false;
    win.loadFile(path.join(__dirname, 'index.html'))
}

module.exports = { openPoswiz, win }