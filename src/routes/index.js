const router = require('express').Router();
const { verifyToken } = require('.././utils/middlewares/verifyAuthToken')
 
const usersRoutes = require('./users');
const teamsRoutes = require('./teams');
const tasksRoutes = require('./tasks');
const commentsRoutes = require('./comments');

router.use('/users', usersRoutes)
router.use('/tasks', verifyToken, tasksRoutes)
router.use('/teams', verifyToken, teamsRoutes)
router.use('/comments', verifyToken, commentsRoutes)

module.exports = router;