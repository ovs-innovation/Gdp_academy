const express = require("express"); // (unused but keeps parity if file expects express in future; safe)
const User = require("../models/userModel.js");
const axios = require("axios");
const OTP = require("../models/otpModel.js");
const Settings = require("../models/settingsModel.js");
const { generateToken } = require("../utils/generateToken.js");
const { rolePermissions } = require("../lib/roles.js");
const Role = require("../models/roleModel.js");
const { resolveRoleKey } = require("../lib/validateRole.js");
const {
  sendOTPEmail,
  sendResetPasswordEmail,
  canSendEmail,
} = require("../utils/emailService.js");
const { getLanguageValue } = require("../utils/languageHelper.js");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
// const firebaseAdmin = require("../config/firebase.js");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// export const googleLogin = async (req, res, next) => {
const googleLogin = async (req, res, next) => {
  try {
    const { credential, accessToken, role } = req.body;
    let email, name, picture, googleId;

    if (accessToken) {
      // Handle OAuth2 Access Token (Implicit flow from custom button)
      const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
      );
      email = data.email;
      name = data.name;
      picture = data.picture;
      googleId = data.sub;
    } else if (credential) {
      // Handle ID Token (JWT from GoogleLogin component)
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      picture = payload.picture;
      googleId = payload.sub;
    } else {
      return res
        .status(400)
        .json({ message: "Google credential or access token is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Register new user via Google
      let userRole = await resolveRoleKey(role || "student");
      if (userRole === "teacher") userRole = "student";

      let status = "active";
      // Generate a random password for Google users (they won't use it but it's required by model)
      const randomPassword = crypto.randomBytes(16).toString("hex");

      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: userRole,
        status,
        googleId,
      });
    } else {
      // User exists, update googleId if not present
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      if (user.status === "inactive" || user.status === "pending") {
        return res.status(403).json({ message: "Account is not active" });
      }
    }

    user.lastLogin = new Date();
    await user.save();

    if (user.role === "student") {
      const StudentProfile = (await import("../models/studentProfileModel.js"))
        .default;
      let studentProfile = await StudentProfile.findOne({
        userId: user._id,
      });
      if (!studentProfile) {
        await StudentProfile.create({ userId: user._id, photo: picture });
      }
    }

    const perms = await resolvePermissions(user.role);
    const token = generateToken(user);
    res.json({ token, user: formatUser(user, perms) });
  } catch (err) {
    console.error("Google Login Error:", err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

const resolvePermissions = async (roleKey) => {
  const role = await Role.findOne({ key: roleKey });
  if (role) return role.permissions || [];
  return rolePermissions[roleKey] || [];
};

const formatUser = (user, perms) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  permissions: perms,
  status: user.status,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
});

// export const register = async (req, res, next) => {
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }
    let userRole = await resolveRoleKey(role || "student");
    if (userRole === "teacher") userRole = "student";

    let status = "active";
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      status,
    });
    const perms = await resolvePermissions(user.role);

    const token = generateToken(user);
    res.status(201).json({ token, user: formatUser(user, perms) });
  } catch (err) {
    next(err);
  }
};

// export const login = async (req, res, next) => {
const login = async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;
    const { appType } = req.query;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (appType === "admin" && user.role === "student") {
      return res.status(403).json({
        message:
          "Students cannot login to admin panel. Please use the student app.",
      });
    }

    if (
      appType === "student" &&
      ["super_admin", "admin", "teacher"].includes(user.role)
    ) {
      return res.status(403).json({
        message: "Please use the admin panel to login.",
      });
    }

    if (user.status === "inactive" || user.status === "pending") {
      return res.status(403).json({ message: "Account is not active" });
    }
    const settings = await Settings.getSettings();
    if (settings.twoFactorAuth) {
      if (!otp) {
        const otpCode = crypto.randomInt(100000, 999999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        if (!canSendEmail()) {
          return res.status(503).json({
            message:
              "Email is not configured yet. Ask admin to set Gmail App Password in backend/.env",
          });
        }
        await OTP.deleteMany({ email, purpose: "login" });
        await OTP.create({ email, otp: otpCode, purpose: "login", expiresAt });
        await sendOTPEmail(email, otpCode, user.name);
        return res.json({
          requiresOTP: true,
          message: "OTP sent to your email",
        });
      }
      const otpRecord = await OTP.findOne({ email, otp, purpose: "login" });
      if (!otpRecord) {
        return res.status(401).json({
          message: "Invalid OTP. Please check your email and try again.",
        });
      }
      if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return res
          .status(401)
          .json({ message: "OTP has expired. Please request a new one." });
      }
      await OTP.deleteOne({ _id: otpRecord._id });
    }
    user.lastLogin = new Date();
    await user.save();

    if (user.role === "student") {
      const StudentProfile = (await import("../models/studentProfileModel.js"))
        .default;
      let studentProfile = await StudentProfile.findOne({ userId: user._id });
      if (!studentProfile) {
        studentProfile = await StudentProfile.create({ userId: user._id });
      }
      const timezone =
        req.body.timezone ||
        req.headers["x-timezone"] ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        "UTC";
      if (timezone) {
        studentProfile.timezone = timezone;
        await studentProfile.save();
      }
    }

    const perms = await resolvePermissions(user.role);
    const token = generateToken(user);
    res.json({ token, user: formatUser(user, perms) });
  } catch (err) {
    next(err);
  }
};

// export const forgotPassword = async (req, res, next) => {
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({
        message: "If that account exists, a code has been sent",
      });
    const otpCode = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OTP.deleteMany({ email, purpose: "reset" });
    await OTP.create({ email, otp: otpCode, purpose: "reset", expiresAt });
    if (!canSendEmail()) {
      return res.status(503).json({
        message:
          "Email is not configured yet. Ask admin to set Gmail App Password in backend/.env",
      });
    }
    await sendResetPasswordEmail(email, otpCode, user.name);
    res.json({ message: "Password reset code sent to your email" });
  } catch (err) {
    next(err);
  }
};

// export const resetPassword = async (req, res, next) => {
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({
        message: "Email, code, and new password are required",
      });
    }
    const otpRecord = await OTP.findOne({ email, otp, purpose: "reset" });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      if (otpRecord) await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(401).json({ message: "Invalid or expired code" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = password;
    await user.save();
    await OTP.deleteMany({ email, purpose: "reset" });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

// export const me = async (req, res, next) => {
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const perms = await resolvePermissions(user.role);
    const userData = formatUser(user, perms);

    if (user.role === "student") {
      const StudentProfile = (await import("../models/studentProfileModel.js"))
        .default;
      let studentProfile = await StudentProfile.findOne({ userId: user._id });
      if (!studentProfile) {
        studentProfile = await StudentProfile.create({ userId: user._id });
      }
      const profileObj = studentProfile.toObject();
      userData.profile = profileObj;
      if (profileObj.photo) userData.photo = profileObj.photo;
    }

    res.json({ user: userData });
  } catch (err) {
    next(err);
  }
};

// export const changePassword = async (req, res, next) => {
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required",
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid current password" });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  googleLogin,
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
  changePassword,
};
