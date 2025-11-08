import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    username: { type: String, required: true },
    text: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    likes: [{ type: String }], // store usernames who liked
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("post", postSchema);


