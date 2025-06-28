# MERN Blog Platform - Backend

This is the backend of a full-featured MERN blog platform, built with Node.js, Express, MongoDB, and Cloudinary for image uploads.

## 🚀 Features

- User authentication with JWT
- Blog post CRUD (Create, Read, Update, Delete)
- Comment system (like, reply, edit, delete)
- Blog post likes and views
- Profile update with avatar upload
- Cloudinary for media storage
- Protected routes via middleware
- MongoDB with Mongoose for data modeling

## 🛠️ Technologies Used

- Node.js
- Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Cloudinary SDK
- Multer for file uploads
- Bcrypt for password hashing
- dotenv for environment variables

## 📁 Folder Structure

backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── uploads/
├── .env
├── server.js
└── package.json


## 🧪 Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/irahulingle/Blog-Platform-Backend.git
   cd mern-blog-backend

npm install

PORT=8000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
cloud_name=<your_cloudinary_cloud_name>
api_key=<your_cloudinary_api_key>
api_secret=<your_cloudinary_api_secret>

npm run dev

📬 API Endpoints
Method	Endpoint	Description
POST	/api/v1/user/register	Register user
POST	/api/v1/user/login	Login user
PUT	/api/v1/user/profile/update	Update profile with image
POST	/api/v1/blog/create	Create new blog
PUT	/api/v1/blog/:blogId	Update a blog post
DELETE	/api/v1/blog/:blogId	Delete a blog post
GET	/api/v1/blog/published	Get all published blogs
PUT	/api/v1/blog/:blogId/toggle	Publish/unpublish blog
POST	/api/v1/comment/:postId	Add comment to blog

