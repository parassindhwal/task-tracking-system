const Task = require('../../models/task')
const Team = require('../../models/team')
const Comment = require('../../models/comment');

const createComment = async (req, res) => {
    try {
        const { content, taskId } = req.body;
        //Find the task to verify it exists and belong to the same team the user belongs\
        const task = await Task.findById(taskId).populate('team');
        if(!task) {
            return res.status(404).json({ message: 'Task not found'})
        }
        const team = task.team;

        //Ensure the user is a member of the team
        if (!team.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'User not authorized for this team' });
          }
      
          const comment = new Comment({ content, task: taskId, createdBy: req.user.id });
          await comment.save();

          return res.status(201).json(comment);
    } catch (err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error creating comment', err });
    }
}

const getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const comments = await Comment.find({ task: taskId }).populate('createdBy', 'name');
        res.json(comments);
    } catch (err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error fetching comment', err });
    }
}

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Ensure only the creator can delete the comment
        if (comment.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'User not authorized to delete this comment' });
        }

        await comment.remove();
        return res.json({ message: 'Comment deleted' });
    } catch (err) {
        console.log({'error': err});

        return res.status(400).json({ message: 'Error deleting comment', err });
    }
}

module.exports = {
    createComment,
    getCommentsByTask,
    deleteComment
}