import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  this.password = await bcryptjs.hash(this.password, 10)
})

userSchema.methods.comparePassword = function (password) {
  return bcryptjs.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema)

export default userModel
