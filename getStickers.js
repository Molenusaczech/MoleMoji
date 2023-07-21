const fs = require('fs');

function getStickers() {
    let data = [];
        const packs = fs.readdirSync('stickers');
        console.log(packs);
        //return packs;

        packs.forEach(pack => {
            let packData = JSON.parse(fs.readFileSync("stickers/" + pack + "/packinfo.json"));
            packData["stickers"] = [];

            const stickers = fs.readdirSync("stickers/" + pack);
            stickers.forEach(sticker => {
                if (sticker != "packinfo.json") {
                    let stickerInfo = JSON.parse(fs.readFileSync("stickers/" + pack + "/" + sticker + "/stickerInfo.json"));
                    stickerInfo["main"] = "stickers/" + pack + "/" + sticker + "/image.png";
                    stickerInfo["preview"] = "stickers/" + pack + "/" + sticker + "/preview.png";
                    packData["stickers"].push(stickerInfo);
                }
            });

            data.push(packData);
        });
        // 



        return data;
}

module.exports = { getStickers };