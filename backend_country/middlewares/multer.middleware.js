import multer from 'multer'

// const storage= multer.diskStorage({          // Devploment ok
//     destination: function (req, file, cb) {
//         cb(null, './public/temp')
//       },
//       filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//       }
// })

// export const upload=multer({storage:storage})

const storage = multer.memoryStorage(); // production-safe

export const upload = multer({
  storage,
  limits: { fileSize: 10*1024*1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});