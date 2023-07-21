const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
    getStickers: async () => {
        let result = await ipcRenderer.invoke('getStickers');
        console.log(result)
        return result;
        //document.getElementById("stickers").innerHTML = html;
    }
})