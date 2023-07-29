const { app } = require('electron');
const fs = require('fs');
const dataPath = app.getPath('userData');

function getStickers() {
    let data = [];
        const packs = fs.readdirSync(dataPath+'/stickers');
        console.log(packs);
        //return packs;

        packs.forEach(pack => {
            let packData = JSON.parse(fs.readFileSync(dataPath+"/stickers/" + pack + "/packinfo.json"));
            packData["stickers"] = [];

            const stickers = fs.readdirSync(dataPath+"/stickers/" + pack);
            stickers.forEach(sticker => {
                if (sticker != "packinfo.json") {
                    let stickerInfo = JSON.parse(fs.readFileSync(dataPath+"/stickers/" + pack + "/" + sticker + "/stickerInfo.json"));
                    stickerInfo["main"] = dataPath+"/stickers/" + pack + "/" + sticker + "/image.png";
                    stickerInfo["preview"] = dataPath+"/stickers/" + pack + "/" + sticker + "/preview.png";
                    packData["stickers"].push(stickerInfo);
                }
            });

            data.push(packData);
        });
        // 



        return data;
}

module.exports = { getStickers };