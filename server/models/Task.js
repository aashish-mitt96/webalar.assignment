import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"  
    },
    status: {
        type: String,
        enum: ["Todo", "In Progress", "Done"],
        default: "Todo"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    }
}, {timestamps: true})

const taskModel = mongoose.model("Task", taskSchema)

export default taskModel