const { app, BrowserWindow, globalShortcut, Tray, screen, Menu, ipcMain, clipboard } = require('electron')
const { openSettings } = require('./settings.js');
const { openPoswiz } = require('./poswizard/posWiz.js');
const path = require('path');
let win;
let lastClipboard = "";
const fs = require('fs');
const { getStickers } = require('./getStickers.js');
const dataPath = app.getPath('userData');

if (require('electron-squirrel-startup')) app.quit();



const isPlayerWindowOpened = () => !win?.isDestroyed() && win?.isFocusable();

const createWindow = () => {
    const config = JSON.parse(fs.readFileSync(dataPath + '/data/config.json', 'utf8'));

    ipcMain.removeHandler('getStickers');
    ipcMain.handle('getStickers', () => {

        return getStickers();

    });

    ipcMain.removeHandler('fetchSticker');
    ipcMain.handle('fetchSticker', async (test, packname, stickername) => {


        return fs.readFileSync(dataPath + "\\stickers\\" + packname + "\\" + stickername + "\\image.png", 'base64');

    });

    win = new BrowserWindow({
        width: config.position.w,
        height: config.position.h,
        frame: false,
        x: config.position.x, //2988
        y: config.position.y, // 470
        alwaysOnTop: true,
        icon: 'icon.ico',
        webPreferences: {
            preload: path.join(__dirname, 'mainPreload.js'),
            nodeIntegration: true, // <--- flag
            nodeIntegrationInWorker: true, // <---  for web workers
            enableRemoteModule: true
        }
    })

    win.loadFile('src/index.html')
}

app.on('ready',
    () => {

        if (!fs.existsSync(dataPath + '/data')) {
            fs.mkdirSync(dataPath + '/data');
            fs.writeFileSync(dataPath + '/data/config.json', JSON.stringify({
                "position": {
                    "x": 0,
                    "y": 0,
                    "w": 200,
                    "h": 200
                }
            }), 'utf8');
        }

        if (!fs.existsSync(dataPath + '/stickers')) {
            fs.mkdirSync(dataPath + '/stickers');
        }

        let tray = null

        tray = new Tray(/*'icon.ico'*/ path.join(__dirname, '../icon.ico'));
        const contextMenu = Menu.buildFromTemplate([
            { label: 'MoleMoji', type: 'normal', enabled: false },
            { type: 'separator' },
            { label: 'Settings', type: 'normal', click: () => { openSettings() } },
            { label: 'Change position', type: 'normal', click: () => { openPoswiz() } },
            { type: 'separator' },
            { label: 'Quit', type: 'normal', role: 'quit', click: () => { app.quit() } },
        ])
        tray.setToolTip('MoleMoji is running..')
        tray.setContextMenu(contextMenu)


        const ret = globalShortcut.register('CommandOrControl+L', () => {
            console.log('Popup opened')
            if (isPlayerWindowOpened()) {
                win.close();
                clipboard.writeText(lastClipboard);
            } else {
                createWindow();
                lastClipboard = clipboard.readText();
            }
        })

        const retDebug = globalShortcut.register('CommandOrControl+K', () => {
            console.log(screen.getCursorScreenPoint());
        })

        if (!ret) {
            console.log('registration failed')
        }

        // Check whether a shortcut is registered.
        console.log(globalShortcut.isRegistered('CommandOrControl+X'))

    })

app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {

}
)