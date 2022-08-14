const { response } = require('express');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
//const { updateImg } = require('../helpers/updateImg');
const path = require('path');
const fs = require('fs');

const fileUpload = async (req, res = response) => {

    const type = req.params.type;
    const id = req.params.id;

    const validTypes = ['users'];

    if (!validTypes.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'type not valid'
        })
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'no files were uploaded'
        })
    }

    //with express-fileupload we can access to files:
    const file = req.files.image;
    const splitFileName = file.name.split('.');
    const extension = splitFileName[splitFileName.length - 1];

    const validExtensions = ['jpg', 'png', 'jpeg', 'gif'];
    if (!validExtensions.includes(extension)) {
        return res.status(400).json({
            ok: false,
            msg: 'the file has no valid extension'
        });
    }

    //generate unique file name 
    const fileName = `${uuidv4()}.${extension}`;

    //save image path
    const path = `./uploads/${type}/${fileName}`;

    file.mv(path, (error) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                msg: 'error'
            })
        }
        //update db:
        //updateImg(type, id, fileName);
        //TODO: save in cloudinary

        res.json({
            ok: true,
            fileName
        })
    })
}

const watchFile = (req, res = response) => {
    const type = req.params.type;
    const file = req.params.path;
    let pathImg = path.join(__dirname, `../uploads/${type}/${file}`);
    if(!fs.existsSync(pathImg)){
        pathImg = path.join(__dirname,'../uploads/no-img.jpg');
    }
    res.sendFile(pathImg);
}

module.exports =
{
    fileUpload,
    watchFile
}