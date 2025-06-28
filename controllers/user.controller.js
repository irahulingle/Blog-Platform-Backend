import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ firstName, lastName, email, password: hashedPassword });

    return res.status(201).json({
      success: true,
      message: "Account created successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register"
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.firstName}`,
      user,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to login"
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).json({
      message: "Logged out successfully",
      success: true
    });
  } catch (error) {
    console.error(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("🟢 updateProfile called");

    const userId = req.user?._id;
    if (!userId) {
      console.log("❌ Missing user ID in req.user");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    console.log("🧑 User ID:", userId);
    console.log("📝 Request body:", req.body);
    console.log("📸 Uploaded file:", req.file?.originalname);

    const {
      firstName,
      lastName,
      occupation,
      bio,
      instagram,
      facebook,
      linkedin,
      github,
    } = req.body;

    const file = req.file;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.log("❌ User not found in DB");
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Assign updated values
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (occupation) user.occupation = occupation;
    if (bio) user.bio = bio;
    if (instagram) user.instagram = instagram;
    if (facebook) user.facebook = facebook;
    if (linkedin) user.linkedin = linkedin;
    if (github) user.github = github;

    // Upload image to Cloudinary
    if (file) {
  const fileUri = getDataUri(file);
  console.log("🧪 fileUri.content exists:", !!fileUri?.content); 
  console.log("🌐 Uploading to Cloudinary...");
  const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
  user.photoUrl = cloudResponse.secure_url;
}

    await user.save();

    console.log("✅ User updated successfully");
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("🔥 Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      total: users.length,
      users
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};
