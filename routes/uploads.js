// api/upload

const { Router, application } = require('express');
const expressfileUpload = require('express-fileupload');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { fileUpload, watchFile } = require('../controllers/uploads');

const router = Router();

//to receive files:
router.use(expressfileUpload());

router.put(
    '/:type/:id',
    [validateJWT],
    fileUpload
);

router.get(
    '/:type/:path',
    watchFile
)

module.exports = router;