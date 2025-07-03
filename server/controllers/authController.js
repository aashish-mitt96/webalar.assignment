import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export async function register(req,res) {
    try {
        const {name, email, password} = req.body
        const user = new User({name, email, password})
        await user.save()
        res.status(201).json({message: "User registeration successful"})
    } catch (error) {
        res.status(400).json({message: "Error in registration", error})
    }
}

export async function login(req,res) {
    try {
        const {email, password} = req.body
        const user = User.findOne({email})
        if (!user) {
            return res.status(401).json({message: "User not found"})
        }
        if (!await user.comparePassword(password)) {
            return res.status(401).json({message: "Invalid Credentials"})
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.status(201).json({ token, user });
    } catch (error) {
        res.status(400).json({message: "Error in login", error})
    }
}