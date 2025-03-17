// imageUtils.js - Image compression utility functions

/**
 * Compresses an image from a data URL to a specified maximum width and quality
 * @param {string} imageDataUrl - The data URL of the image to compress
 * @param {number} maxWidth - Maximum width of the compressed image (default: 800px)
 * @param {number} quality - Quality of compression between 0 and 1 (default: 0.7)
 * @returns {Promise<string>} A promise that resolves to the compressed image data URL
 */
export const compressImage = (imageDataUrl, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageDataUrl;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = Math.floor(height * (maxWidth / width));
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed JPEG format
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
  });
};

/**
 * Resizes an image file and returns a File object
 * @param {File} file - The original image file
 * @param {number} maxWidth - Maximum width of the resized image
 * @param {number} quality - Quality of compression between 0 and 1
 * @returns {Promise<File>} A promise that resolves to the resized File object
 */
export const resizeImageFile = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.floor(height * (maxWidth / width));
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob((blob) => {
          // Create a new File object
          const resizedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          
          resolve(resizedFile);
        }, 'image/jpeg', quality);
      };
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};