/**
 * Upload Service
 * Handles file uploads to Firebase Storage.
 * Returns public download URLs that are then stored in the backend as content URLs.
 *
 * Guardrails are enforced via mediaGuardrails.ts BEFORE any bytes are sent to Firebase.
 */

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { validateMediaFile } from "./mediaGuardrails";

export type UploadType = "image" | "voice" | "video";

export interface UploadProgress {
  progress: number; // 0-100
  url?: string;
  error?: string;
}

/**
 * Generates a unique storage path for a file.
 */
function getStoragePath(flowerId: string, type: UploadType, file: File): string {
  const ext = file.name.split(".").pop() || "bin";
  const timestamp = Date.now();
  return `flowers/${flowerId}/${type}/${timestamp}.${ext}`;
}

/**
 * Uploads a file to Firebase Storage with progress tracking.
 * Validates size, type, and duration (for audio/video) BEFORE uploading.
 *
 * @param file - The file to upload
 * @param type - The type of media ('image' | 'voice' | 'video')
 * @param flowerId - Used to organise files in storage folders
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns The public download URL
 * @throws MediaValidationError if the file fails guardrail checks
 */
export async function uploadMedia(
  file: File,
  type: UploadType,
  flowerId: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  // Run guardrail validation (throws MediaValidationError on failure)
  await validateMediaFile(file, type);

  const path = getStoragePath(flowerId, type, file);
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress?.(progress);
      },
      (error) => {
        console.error("Firebase upload error:", error);
        reject(new Error("Upload failed. Please try again."));
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch {
          reject(new Error("Failed to get download URL."));
        }
      },
    );
  });
}

/**
 * A "pending" upload — holds a File that hasn't been uploaded yet,
 * or a URL that has already been uploaded / pre-existing.
 */
export interface PendingUpload {
  file?: File; // set when user selected a file
  url?: string; // set after successful upload
  previewUrl?: string; // local object URL for preview (revoked after upload)
}

/**
 * Creates a local preview URL for a file (use URL.revokeObjectURL when done).
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Deletes a list of Firebase Storage files by their download URLs.
 * Fails silently per file — a missing or already-deleted file won't block the rest.
 * Safe to call fire-and-forget (no need to await at call site).
 */
export async function deleteMediaFiles(
  urls: (string | null | undefined)[],
): Promise<void> {
  const validUrls = urls.filter(Boolean) as string[];
  await Promise.allSettled(
    validUrls.map(async (url) => {
      try {
        // Firebase accepts full download URLs — it parses the storage path internally
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
      } catch (e) {
        // File may already be deleted or not exist — log and continue
        console.warn("Failed to delete Firebase file:", url, e);
      }
    }),
  );
}
