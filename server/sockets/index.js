import Task from "../models/Task.js"

export const handleSocket = (socket, io) => {
  socket.on("task:created", async () => {
    const tasks = await Task.find().populate("assignedTo", "name")
    io.emit("tasks:update", tasks)
  })

  socket.on("task:updated", async () => {
    const tasks = await Task.find().populate("assignedTo", "name")
    io.emit("tasks:update", tasks)
  })

  socket.on("task:deleted", async () => {
    const tasks = await Task.find().populate("assignedTo", "name")
    io.emit("tasks:update", tasks)
  })
}