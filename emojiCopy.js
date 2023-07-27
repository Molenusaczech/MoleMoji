function copy(link) {
  console.log(link);

  fetch(link)
    .then((res) => res.blob())
    .then((myBlob) => {
      console.log(myBlob);
      // logs: Blob { size: 1024, type: "image/jpeg" }
      navigator.clipboard.write([
        new ClipboardItem({
          'image/png': myBlob
        })
      ]);
    });

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
        <div onclick=copy("${sticker.main}") class="sticker">
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