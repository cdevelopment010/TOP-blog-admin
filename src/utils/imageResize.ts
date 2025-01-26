export const imageResize = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof File)) {
        reject(new Error("Invalid file input"));
        return;
      }
  
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const img = new Image();
  
        img.onload = () => {
          const desiredWidth = 300;
          const aspectRatio = img.width / img.height;
          const desiredHeight = desiredWidth / aspectRatio;
  
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
  
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }
  
          canvas.width = desiredWidth;
          canvas.height = desiredHeight;
  
          ctx.drawImage(img, 0, 0, desiredWidth, desiredHeight);
  
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas is empty or failed to create Blob"));
              }
            },
            "image/jpeg",
            0.8
          );
        };
  
        img.onerror = () => {
          reject(new Error("Image failed to load"));
        };
  
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error("FileReader result is empty"));
        }
      };
  
      reader.onerror = () => {
        reject(new Error("FileReader failed to read the file"));
      };
  
      reader.readAsDataURL(file);
    });
  };