// Vercel caps request bodies around 4.5MB, so images are downscaled client-
// side before upload; PDFs pass through untouched. A presign flow would lift
// the cap entirely — deliberately out of scope for now.
const MAX_EDGE = 2000;
const QUALITY = 0.85;

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    // PNG screenshots re-encode to WebP for a large size win; JPEG stays JPEG.
    const targetType = file.type === "image/jpeg" ? "image/jpeg" : "image/webp";
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, targetType, QUALITY),
    );
    if (!blob || blob.size >= file.size) return file;

    const ext = targetType === "image/jpeg" ? "jpg" : "webp";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.${ext}`, { type: targetType });
  } catch {
    return file;
  }
}
