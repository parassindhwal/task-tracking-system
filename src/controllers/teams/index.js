const Team = require('../../models/team');
const mongoose = require('mongoose');

const createTeam = async (req, res) => {
    const { name, description, members } = req.body;

    try {
        let membersObjectIds = members.map(member => new mongoose.Types.ObjectId(member));
        membersObjectIds.push(req.user.id);

        const team = new Team({
            name,
            description,
            members: membersObjectIds,
            createdBy: req.user.id
        })

        await team.save();
        return res.status(201).json({team});
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error creating team', err });
    }
}

const getTeams = async (req, res) => {
    try {
        console.log(req.user.id);
        const teams = await Team.find({ members: req.user.id});
        console.log(teams);
        return res.status(200).json(teams);
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error fetching teams', err });
    }
}

const getTeamById = async (req, res) => {
    try {
        const teamId  = req.params.id
        if(teamId) {
            const team = await Team.findById(teamId).populate('members');

            if(team) {
                return res.status(200).json(team);
            }
            return res.status(404).json({ message: 'Team not found' });

        } else {
            return res.status(404).json({ message: 'Team id is required' });
        }
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error fetching teams', err });
    }
}

const updateTeam = async (req, res) => {
    try {
        const teamId  = req.params.id
        const updates = req.body;

        if(teamId) {
            if(updates.menbers) {
                updates.menbers = updates.members.map(member => new mongoose.Types.ObjectId(member))
            }
            const team = await Team.findOneAndUpdate(
                { _id: teamId},
                { $set: updates },
                { new: true, runValidators: true }
            )

            if(!team) {
                return res.status(404).json({ error: "Team not found"});
            }

            return res.status(200).json({
                message: "Team details updated successfully",
                team: team
            })
        }
    } catch(err) {
        // Log the error for server-side debugging
        console.error("Error updating team details:", err);

        // Respond with an error message
        return res.status(500).json({ error: "An error occurred while updating the team details. Please try again later." });
    }
}

const inviteToTeam = async (req, res) => {
    try {
        const { userId } = req.body;
        const team = await Team.findById(req.params.id)

        if(!team) {
            return res.status(404).json({ message: 'Team not found'});   
        }

        if(team.members.includes(userId)) {
            return res.status(400).json({ message: 'User already a member of the team' });
        }
        team.members.push(userId);
        await team.save();
        return res.status(200).json({ message: 'User added to the team' });
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error inviting user to teams', err });
    }
}

module.exports = {
    createTeam,
    getTeams,
    updateTeam,
    getTeamById,
    inviteToTeam
}