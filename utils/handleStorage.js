const multer = require('multer');
const memoryStorage = multer.memoryStorage();

const multerOptions = {
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10MB por archivo
    files: 5, // Número máximo de archivos permitidos
  },
  fileFilter: (req, file, callback) => {
    // Validar tipos de archivo (solo imágenes)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true); // Aceptar el archivo
    } else {
      callback(new Error("Tipo de archivo no permitido. Solo se aceptan imágenes (JPEG, PNG, GIF, WEBP)."), false);
    }
  },
};

// Middleware para subida en memoria
const uploadMiddlewareMemory = multer(multerOptions); 

module.exports = uploadMiddlewareMemory;