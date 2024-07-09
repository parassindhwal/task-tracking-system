const router = require('express').Router();
const { createComment, getCommentsByTask, deleteComment} = require('../../controllers/comments')

router.post('/', createComment); // Endpoint to create a comment

router.get('/task/:taskId', getCommentsByTask); // Get comments for a specific task

router.delete('/:id', deleteComment); // Delete a specific comment

module.exports = router