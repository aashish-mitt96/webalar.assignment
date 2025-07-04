import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  action: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now },
});

const logModel = mongoose.model("Log", logSchema);

export default logModel;
