export const compressImage = (file, maxWidth = 1024, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      image.src = event.target.result;
    };

    reader.onerror = reject;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, maxWidth / image.width);
      const width = image.width * scale;
      const height = image.height * scale;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas not supported");

      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Compression failed");
          const compressedFile = new File([blob], file.name, { type: "image/jpeg" });
          resolve(compressedFile);
        },
        "image/jpeg",
        quality
      );
    };

    reader.readAsDataURL(file);
  });
};
