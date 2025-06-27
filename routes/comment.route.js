import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createComment,
  getCommentsOfPost,
  editComment,
  deleteComment,
  likeComment,
  getAllCommentsOnMyBlogs,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/my-blogs/comments", isAuthenticated, getAllCommentsOnMyBlogs);
router.get("/:postId", getCommentsOfPost);
router.post("/:postId", isAuthenticated, createComment);
router.put("/:commentId", isAuthenticated, editComment);
router.delete("/:commentId", isAuthenticated, deleteComment);
router.patch("/like/:commentId", isAuthenticated, likeComment);

export default router;
