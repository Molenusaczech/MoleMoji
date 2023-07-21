const { contextBridge, ipcRenderer } = require('electron');
const { BrowserWindow } = require('@electron/remote/main')
const fs = require('fs');
const path = require('path');
let window = undefined;
const isWindowOpened = () => !window?.isDestroyed() && window?.isFocusable();

contextBridge.exposeInMainWorld('setVar', {
    setPos: (x, y) => {
        let file = JSON.parse(fs.readFileSync('data/config.json'));

        file.position.x = x;
        file.position.y = y;

        fs.writeFileSync('data/config.json', JSON.stringify(file, null, 2));
    },
    getStickers: async () => {
        let result = await ipcRenderer.invoke('getStickers');
        console.log(result)
        let html = "";
        result.forEach(pack => {
            html += `<div class="pack">
                <div class="pack-header">
                    <div class="pack-name">${pack.name}</div>
                    <div class="pack-desc">${pack.description}</div>
                    <button class="pack-create" onclick="createSticker('${pack.name}')">Create sticker</button>
                </div>
                <div class="pack-stickers">`;
            pack.stickers.forEach(sticker => {
                html += `<div class="sticker">
                    <img class="sticker-image" src="${sticker.preview}" />
                    <div class="sticker-name">${sticker.name}</div>
                </div>`;
            });
            html += `</div></div>`;

        });
        console.log(html);
        return html;
        //document.getElementById("stickers").innerHTML = html;
    },
    createPack: async (name, author, description) => {
        let json = {
            name: name,
            author: author,
            description: description,
        }
        fs.mkdirSync("stickers/"+name);
        fs.writeFileSync("stickers/"+name+"/packinfo.json", JSON.stringify(json, null, 2));
    },
    getFilePath: async () => {
        return await ipcRenderer.invoke('getFilePath');
    },
    createSticker: async (name, desc, pack, file, preview) => {
        console.log("creating sticker");
        console.log(name, desc, pack, file, preview);
        fs.mkdirSync("stickers/"+pack+"/"+name);
        let infoFile = fs.writeFileSync("stickers/"+pack+"/"+name+"/stickerinfo.json", JSON.stringify({
            name: name,
            description: desc,
            mode: "local",
        }));
        let mainFile = fs.copyFileSync(file, "stickers/"+pack+"/"+name+"/image.png");
        let previewFile = fs.copyFileSync(preview, "stickers/"+pack+"/"+name+"/preview.png");
        
       
    }
})