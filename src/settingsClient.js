let currentPack = null;

const renderStickers = async () => {
    let html = await window.setVar.getStickers();
    document.getElementById("stickers").innerHTML = html;
}

const createSticker = async (packName) => {
    currentPack = packName;
    document.getElementById("createStickerPack").innerHTML = packName;
    document.getElementById("createStickerDialog").showModal();
}

const deleteSticker = async (packname, stickerName) => {

    if (!confirm("Are you sure you want to delete this sticker?")) return;

    window.setVar.deleteSticker(packname, stickerName).then(() => {
        renderStickers();
    });
}

const deletePack = async (packname) => {
    if (!confirm("Are you sure you want to delete this pack?")) return;
    if (!confirm("Are you sure? This action will PERMANENTLY delete this pack and all stickers in it!")) return;
    if (!confirm("This is the last warning! This will delete the pack and all of its stickers!")) return;

    window.setVar.deletePack(packname).then(() => {
        renderStickers();
    });
}

const openFolder = async () => {
    window.setVar.openFolder();
}

/*document.getElementById("popupPos").addEventListener("click", function() {
    let popupX = document.getElementById("popupX").value;
    let popupY = document.getElementById("popupY").value;


    window.setVar.setPos(popupX, popupY);

});*/

document.getElementById("createPackButton").addEventListener("click", async () => {
    let packName = document.getElementById("packName").value;
    let packAuthor = document.getElementById("packAuthor").value;
    let packDescription = document.getElementById("packDescription").value;

    window.setVar.createPack(packName, packAuthor, packDescription).then(() => {
        renderStickers();
    });
});

document.getElementById("showCreateModal").addEventListener("click", () => {
    console.log("show");
    document.getElementById("createDialog").showModal();
});

document.getElementById("closeCreateModal").addEventListener("click", () => {
    console.log("show");
    document.getElementById("createDialog").close();
});

document.getElementById("stickerFileButton").addEventListener("click", () => {
    window.setVar.getFilePath().then((path) => {
        if (path != undefined) document.getElementById("stickerFile").value = path;
    });
});

document.getElementById("stickerPreviewFileButton").addEventListener("click", () => {
    window.setVar.getFilePath().then((path) => {
        if (path != undefined) document.getElementById("stickerPreviewFile").value = path;
    });
});

document.getElementById("closeCreateStickerModal").addEventListener("click", () => {
    console.log("show");
    document.getElementById("createStickerDialog").close();
});

document.getElementById("createStickerButton").addEventListener("click", async () => {

    let stickerName = document.getElementById("stickerName").value;
    let stickerDesc = document.getElementById("stickerDescription").value;
    let stickerFile = document.getElementById("stickerFile").value;
    let stickerPreviewFile = document.getElementById("stickerPreviewFile").value;


    window.setVar.createSticker(
        stickerName,
        stickerDesc,
        currentPack,
        stickerFile,
        stickerPreviewFile
    ).then(() => {
        document.getElementById("createStickerDialog").close();
        renderStickers();
    });
});

renderStickers();