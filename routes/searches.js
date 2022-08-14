// api/search

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { find,findInCollection } = require('../controllers/searches');

const router = Router();

router.get(
    '/:by',
    [validateJWT],
    find
);
router.get(
    '/:table/:by',
    [validateJWT],
    findInCollection
);

module.exports = router;