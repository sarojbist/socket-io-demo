import { UserModel } from "@/Models/UserModel";
import { generateJwt } from "@/Utils/jwtAuth";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';

class UserController {
  // Register
  register = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }

      // Check if user exists
      const existingUser = await UserModel.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await UserModel.create({
        username,
        email,
        password: hashedPassword
      });

      // Generate token
      const token = generateJwt({ id: user._id, username: user.username })

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isOnline: user.isOnline
        },
        message: 'User registered successfully'
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Login
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate token
      const token = generateJwt({ id: user._id, username: user.username })


      return res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isOnline: user.isOnline
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get current user
  getMe = async (req, res) => {

    const userId = req.body.id;
    try {
      const user = await UserModel.findById(userId).select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isOnline: user.isOnline,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get online users
  getOnlineUsers = async (req, res) => {
    try {
      const users = await UserModel.find({ isOnline: true })
        .select('username email');

      return res.status(200).json({
        success: true,
        users
      });
    } catch (error) {
      console.error('Get online users error:', error);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get all users sorted by online first, then offline
  getAllUsersSorted = async (req, res) => {
    try {
      const users = await UserModel
        .find({})
        .select("-password")
        .sort({ isOnline: -1, username: 1 });
      // online first, then alphabetical

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.error("Get all users sorted error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


  // spocket route for making user active
  makeUserActive = async ({ userId, token }, socket) => {

    try {
      const userCheck = await UserModel.findById(userId);

      if (!userCheck) {
        socket.emit("make-user-active-error", {
          success: false,
          message: "User not found",
        });
        return;
      }

      userCheck.isOnline = true;
      await userCheck.save();

      socket.emit("make-user-active-success", {
        success: true,
        message: "User is active",
      });


    } catch (error) {
      console.error('Make user active error:', error);
      socket.emit("make-user-active-error", {
        success: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();