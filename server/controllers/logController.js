import Log from '../models/Log.js'

export async function getLogs(req,res) {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(20).populate("user", "name")
        res.json(logs)
    } catch (error) {
        res.json({message: "Error in getting logs", error})
    }
}
