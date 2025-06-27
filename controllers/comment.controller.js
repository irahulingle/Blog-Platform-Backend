import Comment from '../models/comment.model.js'
import { Blog } from '../models/blog.model.js'

// ✅ Create a comment on a blog post
export const createComment = async (req, res) => {
  try {
    const { content } = req.body
    const { postId } = req.params
    const userId = req.user._id

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' })
    }

    const comment = await Comment.create({ content, postId, userId })

    await Blog.findByIdAndUpdate(postId, {
      $push: { comments: comment._id }
    })

    res.status(201).json({ success: true, message: 'Comment created', comment })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create comment', error: err.message })
  }
}

// ✅ Get all comments for a blog post
export const getCommentsOfPost = async (req, res) => {
  try {
    const { postId } = req.params

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName photoUrl')

    res.status(200).json({ success: true, comments })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch comments', error: err.message })
  }
}

// ✅ Edit a comment
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const { content } = req.body
    const userId = req.user._id

    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' })
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    comment.content = content
    await comment.save()

    res.status(200).json({ success: true, message: 'Comment updated' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to edit comment', error: err.message })
  }
}

// ✅ Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const userId = req.user._id

    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' })
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    await Comment.findByIdAndDelete(commentId)
    await Blog.findByIdAndUpdate(comment.postId, {
      $pull: { comments: commentId }
    })

    res.status(200).json({ success: true, message: 'Comment deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete comment', error: err.message })
  }
}

// ✅ Like or unlike a comment
export const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params
    const userId = req.user._id

    const comment = await Comment.findById(commentId)
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' })

    const alreadyLiked = comment.likes.includes(userId.toString())

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      alreadyLiked
        ? { $pull: { likes: userId }, $inc: { numberOfLikes: -1 } }
        : { $addToSet: { likes: userId }, $inc: { numberOfLikes: 1 } },
      { new: true }
    ).populate('userId', 'firstName lastName photoUrl')

    res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Unliked' : 'Liked',
      updatedComment
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to like/unlike comment', error: err.message })
  }
}

// ✅ Get all comments across my blog posts
export const getAllCommentsOnMyBlogs = async (req, res) => {
  try {
    const userId = req.user._id

    const blogs = await Blog.find({ author: userId }).select('_id')
    const blogIds = blogs.map(blog => blog._id)

    const comments = await Comment.find({ postId: { $in: blogIds } })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName photoUrl')

    res.status(200).json({ success: true, comments })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog comments', error: err.message })
  }
}
