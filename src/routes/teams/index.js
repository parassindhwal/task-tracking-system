const router = require('express').Router();

const { createTeam, getTeams, getTeamById, inviteToTeam, updateTeam } = require('../../controllers/teams')

const { validateTeamData } = require('../../utils/validators')

router.post('/', validateTeamData, createTeam)

router.get('/', getTeams)

router.get('/:id', getTeamById)

router.put('/:id', validateTeamData, updateTeam)

router.post('/:id/invite', inviteToTeam)

module.exports = router