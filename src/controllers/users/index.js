const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const UserProfile = require('../../models/userProfile');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        })
        await user.save();
        return res.status(201).send({message: "User registered successfully"});
    } catch (err) {
        return res.status(500).send(err)
    }
}

const login = async (req, res) => {
    try {
        let emailPassed = req.body.email
        let passwordPassed = req.body.password
        let user = await User.findOne({email: emailPassed})
        if(!user) {
            return res.status(404).send({message: 'User not found'});
        }
        let isPasswordValid = bcrypt.compareSync(passwordPassed, user.password)
        if(!isPasswordValid) {
            return res.status(401).send({message: "Invalid Password"});
        }
        let token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: 86400 });
        return res.status(200).send({ token })
    } catch(err) {
        return res.status(500).json({error: err});
    }
}

const createUserProfile = async (req, res) => {
    try {
        const { username, firstName, lastName, dateOfBirth, title, bio } = req.body
        const { id: userId } = req.user;

        const profile = await UserProfile.findOne({ userId })
        if(profile) {
            return res.status(409).json({
                error: "Conflict",
                message: "User profile already exists",
            })
        }

        const userProfile = new UserProfile({
            userId,
            username,
            firstName,
            lastName,
            dateOfBirth,
            title,
            bio,
        })

        await userProfile.save();
        return res.status(201).send({message: "User profile created successfully"});
    } catch (err) {
        // Log the error (for server-side debugging)
        console.error("Error creating user profile:", err);

        // Respond with an error message
        return res.status(500).json({ error: "An error occurred while creating the user profile. Please try again later." });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        const updateUserProfile = await UserProfile.findOneAndUpdate(
            { userId },
            { $set: updates },
            { new: true, runValidators: true }
        )

        if(!updateUserProfile) {
            return res.status(404).json({ error: "User profile not found"});
        }

        return res.status(200).json({
            message: "User profile updated successfully",
            profile: updateUserProfile
        })

    } catch(err) {
        // Log the error for server-side debugging
        console.error("Error updating user profile:", err);

        // Respond with an error message
        return res.status(500).json({ error: "An error occurred while updating the user profile. Please try again later." });
    }
}

const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const profile = await UserProfile.findOne({ userId })

        if(profile) {
            return res.status(200).json({
                profile,
                message: "User profile retrived successfully"
            })
        }

    } catch(err) {
         // Log the error for server-side debugging
         console.error("Error in getting user profile:", err);

         // Respond with an error message
         return res.status(500).json({ error: "An error occurred while retriving the user profile. Please try again later." });
    }
}

const logout = async (req, res) => {
    try {
        // const token = req.headers["authorization"]?.split("JWT ")[1];
    
        // if(token) {
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //     const expiry = decoded.exp - Math.floor(Date.now() / 1000); // Calculate remaining expiry time

        //     const redisClient = getClient();
        //     await redisClient.setAsync(token, 'blacklisted', 'EX', expiry);
            return res.status(200).json({ message: 'User logged out successfully' });
       
    } catch(err) {
        // Log the error for server-side debugging
        console.error("Error in logging out user:", err);

        // Respond with an error message
        return res.status(500).json({ error: "An error occurred while performing logout. Please try again later." });
    }
}

module.exports = {
    register,
    login,
    createUserProfile,
    updateUserProfile,
    getUserProfile,
    logout
}