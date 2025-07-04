import http from "http"
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import { Server } from "socket.io"

import logRoutes from "./routes/logRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/logs", logRoutes)

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: "*"} })


io.on("connection", (socket) => {
  console.log("User connected:", socket.id)
  socket.on("taskUpdated", (data) => {
    socket.broadcast.emit("taskUpdated", data)
  })
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => { server.listen(PORT, () => console.log(`Server running on port ${PORT}`)) })
  .catch((err) => console.log(err))
