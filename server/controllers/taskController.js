import Task from "../models/Task.js";
import Log from "../models/Log.js";
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name");
  res.json(tasks);
};

export const createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Ensure title is unique and not "Todo", etc.
    if (["Todo", "In Progress", "Done"].includes(title)) {
      return res.status(400).json({ message: "Invalid task title" });
    }

    const existing = await Task.findOne({ title });
    if (existing)
      return res.status(400).json({ message: "Title already exists" });

    const task = await Task.create({ title, description, priority });
    await Log.create({ action: `Created task "${title}"`, userId: req.user });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status, priority, version } =
      req.body;

    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Conflict handling
    if (version && version !== task.__v) {
      return res.status(409).json({
        message: "Conflict detected",
        currentTask: task,
      });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.assignedTo = assignedTo ?? task.assignedTo;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.__v += 1; // Increment version

    await task.save();
    await Log.create({
      action: `Updated task "${task.title}"`,
      userId: req.user,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await Log.create({
      action: `Deleted task "${task.title}"`,
      userId: req.user,
    });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const smartAssign = async (req, res) => {
  try {
    const { taskId } = req.params;

    const users = await User.find();
    let minUser = null;
    let minTasks = Infinity;

    for (let user of users) {
      const taskCount = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: "Done" },
      });

      if (taskCount < minTasks) {
        minTasks = taskCount;
        minUser = user;
      }
    }

    const task = await Task.findById(taskId);
    task.assignedTo = minUser._id;
    await task.save();

    await Log.create({
      action: `Smart assigned task "${task.title}" to ${minUser.name}`,
      userId: req.user,
    });

    res.json({ task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
