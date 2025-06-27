import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const createBlog = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({ message: "Blog title and category is required." });
    }
    const blog = await Blog.create({ title, category, author: req.id });
    return res.status(201).json({ success: true, blog, message: "Blog Created Successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create blog" });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const { title, subtitle, description, category } = req.body;
    const file = req.file;

    let blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (blog.author.toString() !== req.id) return res.status(403).json({ success: false, message: "Unauthorized to edit" });

    let thumbnail;
    if (file) {
      const fileUri = getDataUri(file);
      const upload = await cloudinary.uploader.upload(fileUri);
      thumbnail = upload.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, subtitle, description, category, thumbnail: thumbnail || blog.thumbnail },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ success: false, message: "Error updating blog" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const userId = req.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    if (blog.author.toString() !== userId) return res.status(403).json({ success: false, message: "Unauthorized to delete" });

    await Blog.findByIdAndDelete(blogId);
    await Comment.deleteMany({ postId: blogId });

    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ success: false, message: "Error deleting blog" });
  }
};

export const getAllBlogs = async (_, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author", "firstName lastName photoUrl").populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "userId", select: "firstName lastName photoUrl" }
    });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching blogs" });
  }
};

export const getPublishedBlog = async (_, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).populate("author", "firstName lastName photoUrl").populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: { path: "userId", select: "firstName lastName photoUrl" }
    });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ message: "Failed to get published blogs" });
  }
};

export const togglePublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found!" });

    blog.isPublished = !blog.isPublished;
    await blog.save();

    const statusMessage = blog.isPublished ? "Published" : "Unpublished";
    res.status(200).json({ success: true, message: `Blog is ${statusMessage}` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

export const getOwnBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate("author", "firstName lastName photoUrl")
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "userId", select: "firstName lastName photoUrl" }
      });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.updateOne({ $addToSet: { likes: req.id } });
    await blog.save();

    res.status(200).json({ success: true, message: "Blog liked" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to like blog" });
  }
};

export const dislikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.updateOne({ $pull: { likes: req.id } });
    await blog.save();

    res.status(200).json({ success: true, message: "Blog disliked" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to dislike blog" });
  }
};

export const getMyTotalBlogLikes = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.id }).select("likes");
    const totalLikes = blogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
    res.status(200).json({ success: true, totalBlogs: blogs.length, totalLikes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch total blog likes" });
  }
};
