const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('main', {
    getStickers: async () => {
        let result = await ipcRenderer.invoke('getStickers');
        console.log(result)
        return result;
        //document.getElementById("stickers").innerHTML = html;
    },
    fetchSticker: async (packname, stickername) => {
        console.log(packname, stickername);
        let result = await ipcRenderer.invoke('fetchSticker', packname, stickername);
        return result;
    }
})