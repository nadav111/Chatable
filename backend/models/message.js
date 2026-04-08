import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

messageSchema.index({ chatId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);