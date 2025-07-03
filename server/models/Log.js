import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    time: {
        type: Date,
        default: Date.now
    }
})

const logModel = mongoose.model("Log", logSchema)

export default logModel