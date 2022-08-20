const { response } = require('express');
const Party = require('../models/party');
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// const find = async (req, res = response) => {

//     const searchParam = req.params.by;

//     //regular expression 'i' for vague search
//     const regex = new RegExp(searchParam, 'i');

//     const [parties] = await Promise.all([
//         Party.find({ id: regex })
//     ])

//     console.log("eee")

//     res.json({
//         ok: true,
//         found: 'found',
//         searchParam,
//         parties
//     })
// }

const postGroup = async (req, res = response) => {

    try {
        //read token:
        const token = req.header('x-token');
        const party = new Party(req.body);

        //get decoded uid from token:
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        //find the user that have done the request
        const user = await User.findById(uid, '');

        //add the user to the members array like admin:
        party.members.push({ email: user.email, admin: true });
        //console.log(party);

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
            const guest = await User.findOne({ 'email': member.email }, '');

            if (!guest || guest.email !== member.email) {
                return;
            }

            guest.groupsInvitations.push(party._id);
            //console.log(guest)
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

        //read token:
        const token = req.header('x-token');

        //get decoded uid from token:
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(uid, '');

        const groups = [];

        await Promise.all(user.groups.map(async (group) => {
            const groupFound = await Party.findById(group);
            groups.push(groupFound);
        }));

        //TODO: borrar
        // console.log("----------------email-----------------")
        // console.log(user.email)
        // console.log("----------------grupos-----------------")
        // console.log(groups) 
        // console.log("------------------fin---------------")

        res.json({
            ok: true,
            parties: groups,
            msg: 'get parties'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error getting party'
        })
    }
}

const getGroupInvitations = async (req, res = response) => {

    try {

        //read token:
        const token = req.header('x-token');

        //get decoded uid from token:
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(uid, '');

        const groups = [];

        await Promise.all(user.groupsInvitations.map(async (group) => {
            const groupFound = await Party.findById(group);
            groups.push(groupFound);
        }));

        res.json({
            ok: true,
            parties: groups,
            msg: 'get party invitations'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'error getting party invitations'
        })
    }
}

const postMedia = async (req, res = response) => {

    const { id, img, name, votes } = req.body;

    try {

        //read token:
        const token = req.header('x-token');

        //get decoded uid from token:
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(uid, '');

        if (user.groups.includes(req.params.id)) {

            const party = await Party.findById(req.params.id);
            const newMediaItem = { "id": id, "img": img, "name": name, "votes": votes };
            party.list.push(newMediaItem);
            await party.save();

            res.json({
                ok: true,
                party
            });

        } else {
            res.status(401).json({
                ok: false,
                msg: 'unauthorized'
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error posting media'
        })
    }
}

const voteMedia = async (req, res = response) => {
    const { mediaId } = req.body;
    let alreadyVoted = false;
    try {
        //read token:
        const token = req.header('x-token');

        //get decoded uid from token:
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(uid, '');

        //user only can vote if the group is included in his groups:
        if (user.groups.includes(req.params.id)) {

            let party = await Party.findById(req.params.id);
            party.list.map(mediaItem => {

                if (mediaItem.id == mediaId && mediaItem.votedFor.includes(user.id)) {
                    alreadyVoted = true;
                }

                if (mediaItem.id == mediaId && !mediaItem.votedFor.includes(user.id)) {
                    mediaItem.votes += 1;
                    mediaItem.votedFor.push(user._id)
                }

            });

            await party.save();

            res.json({
                ok: true,
                party,
                alreadyVoted
            });

        } else {
            res.status(401).json({
                ok: false,
                msg: 'unauthorized'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'error posting media'
        })
    }
}


module.exports = { postGroup, getGroupsByUser, getGroupInvitations, postMedia, voteMedia }