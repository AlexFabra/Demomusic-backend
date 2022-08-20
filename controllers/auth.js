const { response } = require('express');
const User = require('../models/user');
//encrypt password library:
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        //verify email:
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: 'email or password not valid'
            });
        }
        //verify password:
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'email or password not valid'
            });
        }

        //generate token:
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            msg: 'welcome',
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error'
        })
    }
}

const googleLogin = async (req, res = response) => {
    try {
        //const googleUser = await googleVerify(req.body.token);
        const { email, name, picture } = await googleVerify(req.body.token);
        const userDb = await User.findOne({ email });
        let user;

        if (!userDb) {
            user = new User({
                name,
                email,
                password: '@@@',
                img: picture,
                google: true,
                groups:[],
                groupsInvitations:[]
            })
        } else {
            user = userDb;
            user.google = true;
        }


        await user.save();

        //generate token:
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            email,
            name,
            picture,
            token
        });

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'error with google token'
        })
    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;
    const user = await User.findById(uid);

    //generate token:
    const token = await generateJWT(uid);

    res.json({
        ok: true,
        token,
        user
    })
}

module.exports = {
    login,
    googleLogin,
    renewToken
}