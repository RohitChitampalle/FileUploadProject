const multer = require('multer');


// Configure Multer to handle form data
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});


module.exports = upload