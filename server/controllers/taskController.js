import Task from '../models/Task.js'
import Log from '../models/Log.js'

export async function getTasks(req,res) {
    try {
        const tasks = await Task.find().populate("assignedTo", "name")
        res.json(tasks)
    } catch (error) {
        res.json({message: "Error in fetching tasks", error})
    }
}

export async function createTask(req,res) {
    try {
        const task = new Task(req.body)
        await task.save()
        await Log.create({ message: `Created task: ${task.title}`, user: req.user.id })
        res.status(201).json(task)
    } catch (error) {
        res.json({message: "Error in creating task", error})
    }
}

export async function updateTask(req,res) {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
        await Log.create({ message: `Updated task: ${task.title}`, user: req.user.id })
        res.json(task)
    } catch (error) {
        res.json({message: "Erro in updating task", error})
    }
}

export async function deleteTask(req,res) {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        await Log.create({ message: `Deleted task: ${task.title}`, user: req.user.id })
        res.json({ message: "Task deleted" })
    } catch (error) {
        res.json({message: "Error in deleting the task", error})
    }
}