import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ]
}, { timestamps: true });

// index to quickly find user chats
chatSchema.index({ participants: 1 });

export default mongoose.model("Chat", chatSchema);