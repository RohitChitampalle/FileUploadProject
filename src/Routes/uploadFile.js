const express = require("express")
const router = express.Router()
const {
  handleGetAllFileList,
  handleUploadFile,
  FileDownload,
  handleDeleteFile
} = require("../Controller/upload_file")
const multerConfig = require("../Middleware/handleFileUpload")
const verifyToken = require("../Middleware/jwt")

router.get("/list/:id", handleGetAllFileList)
router.post("/upload", multerConfig.single('file'), handleUploadFile)
router.get('/download/:id',multerConfig.any(), FileDownload)
router.delete('/delete/:id', multerConfig.any(),handleDeleteFile)

module.exports = router;