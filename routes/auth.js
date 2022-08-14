// path: /api/login

const { Router } = require('express');
const { login, googleLogin, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/', [
    check('email', 'Email required').isEmail(),
    check('password', 'password required').not().isEmpty(),
    validateFields
],
    login
)

router.post('/google', [
    check('token', 'google token required').not().isEmpty(),
    validateFields
],
    googleLogin
)

router.get('/renew', [
   validateJWT
],
    renewToken
)



module.exports = router;