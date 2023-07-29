const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');


contextBridge.exposeInMainWorld('poswiz', {
    setPos: () => {
        console.log('setPos');
        console.log(window);
        ipcRenderer.invoke('setPos');
    }
})