const { contextBridge, ipcRenderer, app } = require('electron');
const fs = require('fs');
const path = require('path');
let window = undefined;
const isWindowOpened = () => !window?.isDestroyed() && window?.isFocusable();


const main = async () => {
    const dataPath = await ipcRenderer.invoke('getAppPath');

    contextBridge.exposeInMainWorld('setVar', {
        setPos: (x, y) => {
            let file = JSON.parse(fs.readFileSync(dataPath + '/data/config.json'));

            file.position.x = x;
            file.position.y = y;

            fs.writeFileSync(dataPath + '/data/config.json', JSON.stringify(file, null, 2));
        },
        getStickers: async () => {
            let result = await ipcRenderer.invoke('getStickers');
            console.log(result)
            let html = "";
            result.forEach(pack => {
                html += `<div class="pack">
                <div class="pack-header">
                    <div class="pack-name">${pack.name} (by ${pack.author})</div>
                    <div class="pack-desc">${pack.description}</div>
                    <button class="pack-create" onclick="createSticker('${pack.name}')">Create sticker</button>
                    <button class="pack-delete" onclick="deletePack('${pack.name}')">Delete pack</button>
                </div>
                <div class="pack-stickers">`;
                pack.stickers.forEach(sticker => {
                    html += `<div class="sticker">
                    <img class="sticker-image" src="${sticker.preview}" />
                    <div class="sticker-name">
                    ${sticker.name}
                    <div class="sticker-delete" onclick="deleteSticker('${pack.name}', '${sticker.name}')">🗑️</div>
                    </div>
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
            fs.mkdirSync(dataPath + "/stickers/" + name);
            fs.writeFileSync(dataPath + "/stickers/" + name + "/packinfo.json", JSON.stringify(json, null, 2));
        },
        getFilePath: async () => {
            return await ipcRenderer.invoke('getFilePath');
        },
        createSticker: async (name, desc, pack, file, preview) => {
            console.log("creating sticker");
            console.log(name, desc, pack, file, preview);
            fs.mkdirSync(dataPath + "/stickers/" + pack + "/" + name);
            let infoFile = fs.writeFileSync(dataPath + "/stickers/" + pack + "/" + name + "/stickerinfo.json", JSON.stringify({
                name: name,
                description: desc,
                mode: "local",
            }));
            let mainFile = fs.copyFileSync(file, dataPath + "/stickers/" + pack + "/" + name + "/image.png");
            let previewFile = fs.copyFileSync(preview, dataPath + "/stickers/" + pack + "/" + name + "/preview.png");


        },
        deleteSticker: async (pack, sticker) => {
            console.log("deleting sticker");
            console.log(pack, sticker);
            fs.rmSync(dataPath + "/stickers/" + pack + "/" + sticker, { recursive: true });
        },
        deletePack: async (pack) => {
            console.log("deleting pack");
            console.log(pack);
            fs.rmSync(dataPath + "/stickers/" + pack, { recursive: true });
        },
        openFolder: async () => {
            ipcRenderer.invoke('openFolder');
        }
    })
}

main();