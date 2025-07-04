import Log from "../models/Log.js";

export const getLogs = async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(20).populate("userId", "name");
  res.json(logs);
};
