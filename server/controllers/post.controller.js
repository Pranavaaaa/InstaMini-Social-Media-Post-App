import Post from "../models/post.model.js";
import { uploadImage } from "../utils/cloudinary.js";

const createPost = async (req, res, next) => {
  try {
    const { text = "", imageUrl: imageUrlBody = "" } = req.body;
    let imageUrl = imageUrlBody;
    let imagePublicId = "";

    if (req.file) {
      const uploadResult = await uploadImage(req.file.buffer);
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    if (!text && !imageUrl) {
      return res.status(400).json({ message: "Either text or image is required" });
    }

    const post = await Post.create({
      userId: req.user._id,
      username: `${req.user.fullName.firstName} ${req.user.fullName.lastName}`,
      text,
      imageUrl,
      imagePublicId,
      likes: [],
      comments: [],
    });

    return res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Post.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments({}),
    ]);

    return res.status(200).json({ items, total, page, limit });
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const username = `${req.user.fullName.firstName} ${req.user.fullName.lastName}`;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.includes(username);
    if (hasLiked) {
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      post.likes.push(username);
    }

    await post.save();
    return res.status(200).json({ likes: post.likes.length, likedBy: post.likes });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const username = `${req.user.fullName.firstName} ${req.user.fullName.lastName}`;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId: req.user._id, username, text });
    await post.save();

    return res.status(201).json({ comments: post.comments });
  } catch (error) {
    next(error);
  }
};

export default { createPost, getFeed, toggleLike, addComment };


