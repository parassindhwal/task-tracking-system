const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'complete'],
        default: 'open',
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachments: [{ type: Buffer,}],
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);