async function resizeImage(file, maxDimension, quality = 0.85) {
    const img = await createImageBitmap(file);

    let { width, height } = img;
    if (width > maxDimension || height > maxDimension) {
        if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
        } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
        }
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getContext("2d").drawImage(img, 0, 0, width, height);

    return new Promise((resolve) => {
        canvas.toBlob(resolve, "image/webp", quality);
    });
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB raw input cap

export const prepareAvatarUploads = async (file) => {
    if (file.size > MAX_UPLOAD_BYTES) {
        throw new Error("Image too large. Please choose a file under 8MB.");
    }

    const [thumb, full] = await Promise.all([
        resizeImage(file, 256, 0.8),
        resizeImage(file, 1024, 0.85),
    ]);

    return { thumb, full };
}