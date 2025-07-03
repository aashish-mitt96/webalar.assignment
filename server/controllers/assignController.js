import User from '../models/User.js'
import Task from '../models/Task.js'
import Log from '../models/Log.js'

export async function smartAssign(req,res) {
    try {
        const users = await User.find()
        const counts = await Promise.all(users.map(async (user) => ({
            user, count: await Task.countDocuments({ assignedTo: user._id, status: { $ne: "Done" } })
        })))
        const leastBusy = counts.sort((a, b) => a.count - b.count)[0].user
        const task = await Task.findByIdAndUpdate(req.params.id, { assignedTo: leastBusy._id }, { new: true })
        await Log.create({ message: `Smart assigned task ${task.title} to ${leastBusy.name}`, user: req.user.id })
        res.json(task);
    } catch (error) {
        res.json({message: "Error in assigning task", error})
    }
}