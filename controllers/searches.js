const { response } = require('express');
const User = require('../models/user');

const find = async (req, res = response) => {

    const searchParam = req.params.by;
    //regular expression 'i' for vague search
    const regex = new RegExp(searchParam, 'i');

    const [users, hospitals, doctors] = await Promise.all([
        User.find({ name: regex }),
        //x.find({ name: regex }),
        //y.find({ name: regex })
    ])

    res.json({
        ok: true,
        found: 'found',
        searchParam,
        users,
        //x,
        //y
    })
}

const findInCollection = async (req, res = response) => {

    const searchTableParam = req.params.table;

    const searchParam = req.params.by;
    //regular expression 'i' for vague search
    const regex = new RegExp(searchParam, 'i');

    let data = [];

    switch (searchTableParam) {
        case 'users':
            data = await User.find({ name: regex })
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'error'
            });
    }

    res.json({
        ok: true,
        results: data
    });

}

module.exports = {
    find,
    findInCollection
}