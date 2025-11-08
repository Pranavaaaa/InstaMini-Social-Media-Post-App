import express from "express";
import multer from "multer";
import { authUser } from "../middlewares/auth.middleware.js";
import postController from "../controllers/post.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create a post (text and/or imageUrl)
router.post("/", authUser, upload.single("image"), postController.createPost);

// Public feed with pagination
router.get("/feed", postController.getFeed);

// Like/unlike
router.post("/:postId/like", authUser, postController.toggleLike);

// Comment
router.post("/:postId/comment", authUser, postController.addComment);

export default router;


