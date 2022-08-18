// route:  /api/groups

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { find, postGroup, getGroupsByUser, postMedia } = require('../controllers/groups');

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

router.post(
    '/:id/media',
    validateJWT,
    postMedia

)

module.exports = router;