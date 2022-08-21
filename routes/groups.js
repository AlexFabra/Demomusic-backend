// route:  /api/groups

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { postGroup, getGroupsByUser, postMedia, voteMedia, getGroupInvitations, acceptInvitation, declineInvitation, deleteMedia } = require('../controllers/groups');

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

router.put(
    '/accept-invitation',
    validateJWT,
    acceptInvitation   
)

router.delete(
    '/decline-invitation',
    validateJWT,
    declineInvitation
)

router.delete(
    '/:id/media',
    validateJWT,
    deleteMedia
)

module.exports = router;