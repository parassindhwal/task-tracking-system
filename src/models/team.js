const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let teamSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    members: [{ 
        type: Schema.Types.ObjectId, ref: 'User'
    }],
    createdBy: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
    }
});

module.exports = mongoose.model('Team', teamSchema);