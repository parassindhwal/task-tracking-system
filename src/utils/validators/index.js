const Joi = require('joi');

const validateObjectId = (value, helpers) => {
    // Validate MongoDB ObjectId (24-character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        return helpers.message('"{{#label}}" must be a valid ObjectId');
    }
    return value;
};
  
const userAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

const userProfileSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    firstName: Joi.string().min(3).max(15),
    lastName: Joi.string().min(3).max(15),
    dateOfBirth: Joi.date(),
    title: Joi.string().min(3).max(15),
    bio: Joi.string().min(10).max(200)
});

const teamSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().allow('').min(10).max(500),
    members: Joi.array().items(Joi.string().custom(validateObjectId, 'ObjectId validation')).optional(),
});

const taskSchema = Joi.object({
    title: Joi.string().max(300).required(),
    description: Joi.string().max(500).optional(),
    dueDate: Joi.date(),
    assignedTo: Joi.array().items(Joi.string().custom(validateObjectId, 'ObjectId validation')).optional(),
    teamId: Joi.string().custom(validateObjectId, 'ObjectId validation').required()
});

const taskUpdateSchema = Joi.object({
    title: Joi.string().max(300).optional(),
    description: Joi.string().max(500).optional(),
    dueDate: Joi.date(),
    assignedTo: Joi.array().items(Joi.string().custom(validateObjectId, 'ObjectId validation')).optional(),
    teamId: Joi.array().items(Joi.string().custom(validateObjectId, 'ObjectId validation')).optional()
});

// const userRegistrationSchema = Joi.object({
//     username: Joi.string().required(),
//     email: Joi.string().email().required(),
//     password: Joi.string()
//     .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
// })

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(
            req.body,
            { abortEarly: false }, // return all errors
        )
    
        if(error) {
            return res.status(400).json({
                message: 'Invalid Details',
                error: error.details.map(err => err.message)
            })
        }
    
        //if no error, then continue the registration
        next();
    }
}

module.exports = {
    validateLogin: validate(userAuthSchema),
    validateUserProfileData: validate(userProfileSchema),
    validateTeamData: validate(teamSchema),
    validateTaskData: validate(taskSchema),
    validateTaskUpdateData: validate(taskUpdateSchema)
}