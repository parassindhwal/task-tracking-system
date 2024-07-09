const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let commentsSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    attachments: [{ type: Buffer}],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentsSchema);