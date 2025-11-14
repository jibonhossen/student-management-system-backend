# Student Management System (SMS) Backend

A simple and efficient backend for managing student data, built with Node.js and Express.

## ✨ What's Inside

- User login and registration
- Secure password protection
- Student records management
- Email notifications
- Easy-to-use API
- Input validation
- Error handling

## 🛠️ Built With

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **JWT** - For secure authentication
- **Nodemailer** - For sending emails
- **Mongoose** - For database operations

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   - Copy `.env.example` to `.env`
   - Update with your details

3. **Run the Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account
- `GET /api/auth/me` - View profile

### Student Management
- `GET /api/students` - List all students
- `POST /api/students` - Add new student
- `GET /api/students/:id` - View student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Remove student

## 🤝 How to Contribute

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📜 License

This project is licensed under the ISC License.

## 📧 Contact

Jibon Hossen - [Your Email]

Project Link: [Your Project URL]
