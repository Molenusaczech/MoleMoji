const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

async function copy(packname, stickername) {
  console.log(packname, stickername);

  let sticker = await window.main.fetchSticker(packname, stickername);

  console.log(sticker);

  navigator.clipboard.write([
    new ClipboardItem({
      'image/png': b64toBlob(sticker, 'image/png')
    })
  ]);

  /*fetch(link)
    .then((res) => res.blob())
    .then((myBlob) => {
      console.log(myBlob);
      // logs: Blob { size: 1024, type: "image/jpeg" }
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': myBlob
        })
      ]);
    });*/

  //navigator.clipboard.writeText(link);

}

const render = async () => {
  let file = await window.main.getStickers().then(data => {

    console.log(data);

    let html = "";

    data.forEach(pack => {
      html += `
      <div class="pack">
      <div>
      <h2>${pack.name}</h2>
      <h3>by ${pack.author}</h3>
      </div>
      <div class="stickerList">
      `;

      pack.stickers.forEach(sticker => {
        html += `<div class="sticker">`;

        html += `
        <div onclick=copy("${pack.name}","${sticker.name}") class="sticker">
        <img src="${sticker.preview}" class="stickerPreview" alt="${sticker.name}">
        <div class="sticker-name">${sticker.name}</div> 
        </div>
        `;

        html += `</div>`;
      });

      html += ` </div>
      </div>`;
    });

    document.getElementById("main").innerHTML = html;

  });

}

render();