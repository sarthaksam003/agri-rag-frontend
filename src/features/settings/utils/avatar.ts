export const MAX_AVATAR_FILE_SIZE = 2 * 1024 * 1024;

const ALLOWED_AVATAR_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getInitials = (name: string): string => {
  if (!name || !name.trim()) return "U";

  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!words.length) return "U";

  const initials = words
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return initials.slice(0, 2) || "U";
};

const loadImage = (source: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not decode the selected image."));
    img.src = source;
  });

const ensureSafeAvatar = async (file: File): Promise<string> => {
  const fileType = file.type.toLowerCase();

  if (!ALLOWED_AVATAR_TYPES.has(fileType)) {
    throw new Error(
      "Unsupported image type. Please choose a JPG, JPEG, PNG, or WEBP file.",
    );
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    throw new Error("Image size must be 2MB or less.");
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const maxDimension = 1024;
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.width, image.height),
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d", {
      alpha: false,
    });

    if (!context) {
      throw new Error("Browser canvas is unavailable for image processing.");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const sanitizeAvatarFile = async (file: File): Promise<string> => {
  if (file.size <= 0) {
    throw new Error("The selected file is empty.");
  }

  return ensureSafeAvatar(file);
};

export const cropAvatarDataUrl = async (
  source: string,
  zoom: number,
  offsetX: number,
  offsetY: number,
): Promise<string> => {
  const image = await loadImage(source);
  const cropSize = Math.max(1, Math.min(image.width, image.height) / Math.max(zoom, 1));

  const normalizedX = clamp(offsetX / 100, -1, 1);
  const normalizedY = clamp(offsetY / 100, -1, 1);

  const sourceX = clamp(
    (image.width - cropSize) / 2 + normalizedX * cropSize * 0.7,
    0,
    Math.max(0, image.width - cropSize),
  );

  const sourceY = clamp(
    (image.height - cropSize) / 2 + normalizedY * cropSize * 0.7,
    0,
    Math.max(0, image.height - cropSize),
  );

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext("2d", {
    alpha: false,
  });

  if (!context) {
    throw new Error("Browser canvas is unavailable for cropping.");
  }

  context.fillStyle = "#eef2ff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  context.drawImage(
    image,
    sourceX,
    sourceY,
    cropSize,
    cropSize,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL("image/jpeg", 0.82);
};
