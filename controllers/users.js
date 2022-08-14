const User = require('../models/user');
const { response } = require('express');
//encrypt password library:
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const getUsers = async (req, res) => {

    const indexInit = Number(req.query.indexinit) || 0;
    const indexEnd = Number(req.query.indexend) || 0;

    //  const users = await User.find().skip(indexInit).limit(indexEnd);
    //  const total = await User.count();

    //method to execute simultaneusly multiple promises
    const [users, total] = await Promise.all([
        User.find({}, 'name email role google img').skip(indexInit).limit(indexEnd),
        User.countDocuments()
    ])

    res.json({
        ok: true,
        users,
        total
    });
};

const postUser = async (req, res = response) => {

    const { name, email, password } = req.body;

    try {

        const emailRepeated = await User.findOne({ email });

        if (emailRepeated) {
            return res.status(400).json({
                ok: false,
                msg: 'the email is already registered'
            })
        }

        const user = new User(req.body);

        //encrypt pwd (1 way hash):
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //generate token:
        const token = await generateJWT(user.id)

        res.json({
            ok: true,
            user,
            msg: 'post user',
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error'
        })
    }

};

const updateUser = async (req, res = response) => {
    const uid = req.params.id;
    try {
        const userDB = await User.findById(uid);
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'inexistent id',
                uid
            })
        }
        //update user
        const { password, google, email, ...fields } = req.body;

        if (userDB.email !== email) {
            //in case that the new email already exists on bdd:
            const existentEmail = await User.findOne({ email });
            if (existentEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'this new email already exists'
                })
            }
        }
        if (!userDB.google) {
            fields.email = email;
        } else if (userDB.email !== email){
            return res.status(400).json({
                ok: false,
                msg: 'cannot change email registered with google account'
            })
        }

        const updatedUser = await User.findByIdAndUpdate(uid, fields, { new: true });

        res.json({
            ok: true,
            user: updatedUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error'
        })
    }
}

const deleteUser = async (req, res = response) => {
    const uid = req.params.id;

    try {

        const userDB = await User.findById(uid);
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'inexistent id'
            })
        }

        await User.findByIdAndDelete(uid);

        res.json({
            ok: true,
            uid
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error'
        })
    }
}




module.exports = {
    getUsers,
    postUser,
    updateUser,
    deleteUser
}