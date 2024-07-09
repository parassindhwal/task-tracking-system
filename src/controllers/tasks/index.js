const Task = require('../../models/task')
const Team = require('../../models/team')

const getTaskById = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findById(id)

        const team = await Team.findById(task.team)

        if(!team || !team.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'User not authorized for this team' })
        } 
        
        return res.status(200).json(task);

    } catch (err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error fetching task', err });
    }
}

const createTask = async (req, res) => {
    const { title, description, dueDate, assignedTo, teamId } = req.body;
    try {
        // verify the user is part of the team
        const team = await Team.findById(teamId);
        if(!team) {
            return res.status(404).json({ message: 'Team not found'})
        }
        if(!team.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'User not authorized for this team' })
        }

        const task = new Task({
            title,
            description,
            dueDate,
            assignedTo,
            createdBy: req.user.id,
            team: teamId
        })
        await task.save();
        return res.status(201).json(task);
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error creating task', err });
    }
}

const deleteTask = async (req, res) => {
    const { id: taskId } = req.params
    try {
        console.log(taskId);
        const deletedTask = await Task.deleteOne({ _id: taskId, createdBy: req.user.id})
    
        // Check if a document was deleted
        if (deletedTask.deletedCount === 0) {
            return res.status(404).send({ message: 'Task not found or not authorized to delete.' });
        }

        // Respond with a success message
        res.status(200).send({ message: 'Task deleted successfully.' });
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error deleting task', err });
    }
}

const getAllTasksByTeam = async (req, res) => {
    const { id: teamId } = req.params
    try {
        // Ensure the user is a member of the team
        const team = await Team.findById(teamId);
        if(!team || !team.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'User not authorized for this team' });
        }

        const tasks = await Task.find({team: teamId})

        return res.status(200).json({tasks});
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error fetching task', err });
    }
}

const searchTasksByTeam = async (req, res) => {
    const { query } = req.query;
    const { id: teamId } = req.params
    try {
        const team = await Team.findById(teamId);
        if(!team || !team.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'User not authorized for this team' });
        }

        const tasks = await Task.find({
            team: teamId,
            $or: [
                { title: { $regex: query, $options: 'i'} },
                { description: { $regex: query, $options: 'i'} }
            ]
        });

        if(tasks.length) {
            return res.status(200).json({tasks})
        }
        return res.status(404).json({message: 'No matching tasks found'});
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error searching task', err });
    }
}

const filterTasksByTeam = async (req, res) => {
    const { status } = req.query;
    const { id: teamId } = req.params
    try {
        const team = await Team.findById(teamId);
        if(!team || !team.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'User not authorized for this team' });
        }

        const tasks = await Task.find({ status, team: teamId });

        if(tasks.length) {
            return res.status(200).json({tasks})
        }
        return res.status(404).json({message: 'No matching tasks found'});
    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error filtering task', err });
    }
}

const updateTask = async (req, res) => {
    const { id: taskId } = req.params;
    const updates = req.body; 
    try {
        // const task = await Task.findById({ _id: taskId, team: teamId });
        const task = await Task.findById(taskId).populate('team');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Ensure the user is a member of the team
        // const team = await Team.findById(teamId);
        console.log(task);
        if (!task.team || !task.team.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'User not authorized for this team' });
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, { $set: updates }, { new: true });
        return res.status(200).json({ message:'Task updated successfully', updatedTask });

    } catch(err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error updating task', err });
    }
}

module.exports = {
    createTask,
    getTaskById,
    getAllTasksByTeam,
    deleteTask,
    searchTasksByTeam,
    filterTasksByTeam,
    updateTask
}