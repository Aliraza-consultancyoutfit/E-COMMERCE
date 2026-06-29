const AVATAR_SIZE = 256;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const readAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

/**
 * Reads an image file and returns a square, center-cropped JPEG data URL
 * (256px) — small enough to store in the user document.
 */
export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image must be under 5MB");
  }

  const dataUrl = await readAsDataUrl(file);
  const image = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return dataUrl;
  }

  const scale = Math.max(AVATAR_SIZE / image.width, AVATAR_SIZE / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  ctx.drawImage(image, (AVATAR_SIZE - width) / 2, (AVATAR_SIZE - height) / 2, width, height);

  return canvas.toDataURL("image/jpeg", 0.85);
}
