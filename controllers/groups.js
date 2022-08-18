const { response } = require('express');
const Party = require('../models/party');
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const find = async (req, res = response) => {

    const searchParam = req.params.by;

    //regular expression 'i' for vague search
    const regex = new RegExp(searchParam, 'i');

    const [parties] = await Promise.all([
        Party.find({ id: regex })
    ])

    res.json({
        ok: true,
        found: 'found',
        searchParam,
        parties
    })
}

const postGroup = async (req, res = response) => {

    try {
        //read token:
        const token = req.header('x-token');
        const party = new Party(req.body);

        //get decoded uid from token:
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        //find the user that have done the request
        const user = await User.findById(uid, '');

        //add the user to the members array:
        party.members.push(user.email);

        await party.save();

        res.json({
            ok: true,
            party,
            msg: 'post party'
        });

        //upload his object to add the group that he just created 
        user.groups.push(party._id);
        await user.save();

        //send invitations to users:
        await Promise.all(party.members.map(async (member) => {
            const guest = await User.findOne({ 'email': member }, '');

            if (!guest || guest.email !== member.email) {
                return;
            }

            guest.groupsInvitations.push(party._id);
            await guest.save();
            //TODO: send invitation with sockets
        }));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error creating party'
        })
    }

}

const getGroupsByUser = async (req, res = response) => {

    try {
        //get decoded uid from token:
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(uid, '');

        const groups = [];

        await Promise.all(user.groups.map(async (group) => {
            const groupFound = await Party.findById(group);
            groups.push(groupFound);
        }));

        res.json({
            ok: true,
            groups,
            msg: 'get parties'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error creating party'
        })
    }
}

module.exports = { find, postGroup, getGroupsByUser }