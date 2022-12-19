const multer = require('multer')
const { v4: uuidv4 } = require('uuid');

const FILE_TYPE_MAP = {
    'image/png' : 'png',
    'image/jpeg' : 'jpeg',
    'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images')
    },

    filename: function(req, file, cb) {
        const filename = uuidv4()
        console.log(file.mimetype)
        const extention = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${filename}.${extention}`)
    }
})

module.exports = storage