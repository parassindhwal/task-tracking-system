const router = require('express').Router();
const { 
    getTaskById, 
    createTask, 
    getAllTasksByTeam, 
    deleteTask, 
    searchTasksByTeam, 
    filterTasksByTeam, 
    updateTask } = require('../../controllers/tasks')

const { validateTaskData, validateTaskUpdateData } = require('../../utils/validators')


//Add dataSchema validation
router.post('/', validateTaskData, createTask)

router.get('/:id', getTaskById)

//Add dataSchema validation
router.put('/:id', validateTaskUpdateData, updateTask)

router.delete('/:id', deleteTask)

router.get('/team/:id', getAllTasksByTeam)

router.get('/search/team/:id', searchTasksByTeam)

router.get('/filter/team/:id', filterTasksByTeam)

module.exports = router