import fs from "fs";

export function unlinkFiles(files: any) {
  if (!Array.isArray(files)) {
    files = [files];
  }

  files.forEach((e: any, i: any) => {
    try {
      if (fs.existsSync(e.path)) {
        fs.unlinkSync(e.path);
        console.warn('[', i+1, '/', files.length, `] ${e.filename} Unlink complete`);
      } else {
        console.warn('[', i+1, '/', files.length, `] ${e.filename} not exists`);
      }
    } catch (err) {
      console.warn('[', i+1, '/', files.length, `] ${e.filename} Unlink failed`);
    }
  });
};
