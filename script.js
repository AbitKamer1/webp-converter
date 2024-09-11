let zip = new JSZip();

function handleFiles() {
    const files = document.getElementById('fileInput').files;

    for (let i = 0; i < files.length; i++) {
        convertToWebP(files[i]);
    }
}

function convertToWebP(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        const imgData = event.target.result;

        const img = new Image();
        img.src = imgData;

        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(function(blob) {
                zip.file(file.name.replace(/\.[^/.]+$/, "") + '.webp', blob);

                const message = document.createElement('p');
                message.textContent = `${file.name} conversion complete.`;
                document.getElementById('output').appendChild(message);

                if (allFilesConverted()) {
                    document.getElementById('downloadButton').style.display = 'block';
                }
            }, 'image/webp');
        };
    };

    reader.readAsDataURL(file);
}

function allFilesConverted() {
    const files = document.getElementById('fileInput').files;

    for (let i = 0; i < files.length; i++) {
        const fileName = files[i].name.replace(/\.[^/.]+$/, "") + '.webp';
        if (!zip.files[fileName]) {
            return false;
        }
    }

    return true;
}

function downloadAll() {
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "converted_images.zip");
        location.reload();
    });
}
