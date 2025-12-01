import { error } from "console";
import { verifyEmail } from "../emailverify/verifyEmail.js";
import { Section } from "../models/sectionModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpMail } from "../emailverify/sendOtpMail.js";
import { rmSync } from "fs";

export const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // ! All fields check
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields are required.",
      });
    }

    // ! user ko check kar raha hu ki pahle se nahi na hai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist.",
      });
    }

    // ! password ko bcrypt
    const hasPassword = await bcrypt.hash(password, 10);

    // ! database me user create
    const newUser = await User.create({
      userName,
      email,
      password: hasPassword,
    });

    // ! token gen
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    // ! email ko verify kar raha hu function ke se jo emailVerify folder me hai
    verifyEmail(token, email, userName);
    newUser.token = token;

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User register successfully.",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // ! check headers ko token hai ya nahi
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing and invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    //   ! verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({
          success: false,
          message: "The registration token has Expired.",
        });
      }
      return res.status(400).json({
        success: false,
        message: " Token Verification failed",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found.",
      });
    }
    user.token = null;
    user.isVerified = true;

    await user.save();
    return res.status(200).json({
      success: true,
      message: "Email verify successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ! all field check
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // ! Email check
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    // ! Password check
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res
        .status(402)
        .json({ success: false, message: "Incorrect Password" });
    }

    //! Check if user is verified
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Verify your account then login" });
    }

    // ! check for existing section and delete it.
    const existingSection = await Section.findOne({ userId: user._id });
    if (existingSection) {
      await Section.deleteOne({ userId: user._id });
    }

    // ! create a new session
    await Section.create({ userId: user._id });

    // !generate token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user.isLoggedIn = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Welcome Back ${user.userName}`,
      accessToken,
      refreshToken,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.userId;
    await Section.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { isLoggedIn: false });

    res.status(200).json({
      success: true,
      message: "Logout successfully.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const forgatPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // ! check user
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    }

    // ! 6 digit otp generate
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // ! otp expiry time 10 min
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    // ! Send OTP by email function
    await sendOtpMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.log("Forgot password error =>", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { email } = req.params;

    //! 📝 Check if OTP provided
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required."
      });
    }

    //! 📝 Check if email exists in DB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    //! 📝 OTP must be generated before verifying
    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated or already verified."
      });
    }

    //! 📝 Check OTP Expiry
    if (user.otpExpiry.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one."
      });
    }

    //! 📝 Compare OTP
    if (otp !== user.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP."
      });
    }

    // !📝 OTP verified -> remove OTP from DB
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    //! 📝 Send success response
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully."
    });

  } catch (error) {
    console.error("OTP verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message
    });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email

    //! 📝 Check required fields
    if (!newPassword || !confirmPassword || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    //! 📝 Check password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    // !📝 Check password strength (optional but recommended)
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
    }

    // !📝 Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // !🔐 Encrypt new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please login again."
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

 