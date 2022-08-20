// route:  /api/groups

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { postGroup, getGroupsByUser, postMedia, voteMedia, getGroupInvitations } = require('../controllers/groups');

const router = Router();

// router.get(
//     '/:by',
//     validateJWT,
//     find
// );

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

router.get(
    '/party-invitations',
    validateJWT,
    getGroupInvitations
)

router.post(
    '/:id/media',
    validateJWT,
    postMedia

)

router.post(
    '/:id/vote',
    validateJWT,
    voteMedia
)

module.exports = router;