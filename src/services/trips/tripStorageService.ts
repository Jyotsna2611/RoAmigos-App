import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Compresses an image file in the browser canvas to avoid unnecessarily large uploads.
 */
export async function compressImage(file: File, maxDimension = 1600, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If not an image, pass through
    if (!file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
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

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}

/**
 * Uploads a trip photo to Firebase Storage.
 * Generates a storage path under `users/${userId}/trips/${tripId}/${Date.now()}_${cleanName}`.
 * Provides fallback to Data URL if Storage fails or is restricted.
 */
export async function uploadTripPhoto(
  userId: string,
  tripId: string,
  file: File
): Promise<{ url: string; storagePath: string }> {
  // Validate file size (< 10MB raw)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Image size must be less than 10MB.');
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9_.]/g, '_');
  const storagePath = `users/${userId}/trips/${tripId}/${Date.now()}_${cleanName}`;

  let compressedBlob: Blob = file;
  try {
    compressedBlob = await compressImage(file);
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, compressedBlob, {
      contentType: 'image/jpeg',
      customMetadata: {
        userId,
        tripId,
        originalName: file.name
      }
    });

    const url = await getDownloadURL(storageRef);
    return { url, storagePath };
  } catch (storageError) {
    console.warn('Firebase Storage upload failed, falling back to compressed Data URL:', storageError);
    // Convert compressed blob to Base64 Data URL so user memory is never lost and document limit is respected
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          resolve(e.target.result);
        } else {
          reject(new Error('Failed to read image data'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(compressedBlob);
    });

    return { url: dataUrl, storagePath: '' };
  }
}

/**
 * Deletes a single file from Firebase Storage.
 */
export async function deleteTripPhotoFromStorage(storagePath: string): Promise<void> {
  if (!storagePath || storagePath.startsWith('data:')) {
    return;
  }

  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (err: any) {
    // If not found, ignore
    if (err?.code !== 'storage/object-not-found') {
      console.warn('Failed to delete storage file:', storagePath, err);
    }
  }
}

/**
 * Deletes multiple photos from Firebase Storage.
 */
export async function deleteTripPhotosBatch(storagePaths: string[]): Promise<void> {
  const validPaths = storagePaths.filter((p) => p && !p.startsWith('data:'));
  await Promise.allSettled(validPaths.map((p) => deleteTripPhotoFromStorage(p)));
}
