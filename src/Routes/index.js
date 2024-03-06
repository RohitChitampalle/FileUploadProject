const express = require("express")
const router = express.Router()
const {
    handleGetAllUsers,
    handleGetUserById,
    UserRegister,
    userLogin,
} = require("../Controller/user")
const upload = require("../Middleware/handleFileUpload")
const verifyToken = require("../Middleware/jwt")

router.get("/", handleGetAllUsers)
router.get("/login", upload.any(), userLogin)
router.get("/:id", handleGetUserById)
router.post("/set", upload.any(), UserRegister)

module.exports = router;