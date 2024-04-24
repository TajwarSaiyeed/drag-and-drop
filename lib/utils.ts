import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { auth } from "@clerk/nextjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileType(filename: string) {
  const extension = filename.split(".").pop().toLowerCase();
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "gif":
      return "image/gif";
    case "tiff":
    case "tif":
      return "image/tiff";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "bmp":
      return "image/bmp";
    case "webp":
      return "image/webp";
    default:
      return null;
  }
}

export const extractText = (text: string, data: any) => {
  const txtWithoutLine = text.replace(/\n/g, " ");
  return data.map((cell: any) => {
    const segments = cell.layout.textAnchor.textSegments;
    return segments
      .map((segment: any) => {
        const startIndex = parseInt(segment.startIndex);
        const endIndex = parseInt(segment.endIndex);
        return txtWithoutLine.slice(startIndex, endIndex);
      })
      .join(" ");
  });
};

export const handleAuth = () => {
  const { userId } = auth();
  if (!userId) {
    return { userId: null };
  }
  return { userId };
};

export function formattedDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}