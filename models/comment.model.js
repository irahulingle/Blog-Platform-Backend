import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    numberOfLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
