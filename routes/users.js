// route:  /api/users

const { Router } = require('express');
const { getUsers, postUser, updateUser, deleteUser } = require('../controllers/users');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateAdminRole } = require('../middlewares/validate-jwt');
const { validateAdminRoleOrOwner } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/', validateJWT, getUsers);
router.post('/',
    [
        check('name', 'the name is required').not().isEmpty(),
        check('password', 'the password is required').not().isEmpty(),
        check('email', 'the email is required').isEmail(),
        validateFields
    ], postUser);

router.put('/:id',
    [
        validateJWT,
        validateAdminRoleOrOwner,
        check('name', 'the name is required').not().isEmpty(),
        check('email', 'the email is required').isEmail(),
        check('role', 'the role is required').not().isEmpty(),
        validateFields
    ], updateUser)

router.delete('/:id',
    [
        validateJWT,
        validateAdminRole
    ]
    , deleteUser)

module.exports = router;