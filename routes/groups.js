// route:  /api/groups

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { find, postGroup, getGroupsByUser } = require('../controllers/groups');

const router = Router();

router.get(
    '/:by',
    validateJWT,
    find
);

router.post(
    '/',
    validateJWT,
    postGroup
);

router.get(
    '/user',
    validateJWT,
    getGroupsByUser
)

module.exports = router;